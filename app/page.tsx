"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import Modal from "@/components/Modal";
import CardComponent from "@/components/CardComponent";
import { generateUniqueId } from "@/utils";



export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/cards")
      .then((res) => res.json())
      .then((data: Card[]) => {
        const existingIds = data.map((card) => card.id).filter(Boolean);
        const updatedCards = data.map((card) => {
          if (!card.id) {
            const newId = generateUniqueId(existingIds);
            existingIds.push(newId);
            return { ...card, id: newId };
          }
          return card;
        });

        setCards(updatedCards);

        // Persist missing IDs back to server
        updatedCards
          .filter((card) => !data.find((original) => original.id === card.id))
          .forEach((card) => {
            fetch(`http://localhost:8000/cards/${card.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(card),
            });
          });
      });
  }, []);
  

  const handleAddCard = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleEditCard = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card) setEditingCard(card);
    setModalOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      fetch(`http://localhost:8000/cards/${id}`, { method: "DELETE" }).then(() =>
        setCards((prev) => prev.filter((card) => card.id !== id))
      );
    }
  };

  const handleSaveCard = (card: Card) => {
    const existingIds = cards.map((c) => c.id).filter(Boolean);
    const newCard: Card = {
      ...card,
      id: card.id || generateUniqueId(existingIds),
    };
  
    if (card.id) {
      // Update existing card
      fetch(`http://localhost:8000/cards/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      })
        .then((res) => res.json())
        .then((updatedCard: Card) =>
          setCards((prev) =>
            prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
          )
        );
    } else {
      // Create new card
      fetch("http://localhost:8000/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      })
        .then((res) => res.json())
        .then((createdCard: Card) => setCards((prev) => [...prev, createdCard]));
    }
  };
  
  return (
    <div>
      <main className="flex flex-col gap-10 p-4">
        {/* Section 1 */}
        <section className="container mx-auto flex flex-col gap-4 p-4 rounded-md shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">My 2DO</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddCard}
          >
            Add Card
          </button>
        </section>

        {/* Section 2 */}
        <section className="container mx-auto flex flex-col gap-4 p-4 rounded-md shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                onEdit={handleEditCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        </section>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <CardForm
            card={editingCard}
            onSave={handleSaveCard}
            onClose={() => setModalOpen(false)}
          />
        </Modal>
      </main>
    </div>
  );
}

function CardForm({
  card,
  onSave,
  onClose,
}: {
  card: Card | null;
  onSave: (card: Card) => void;
  onClose: () => void;
}) {
  const [formState, setFormState] = useState<Card>(
    card || { id: "", name: "", status: "to-do", description: "" }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
          pattern="[A-Za-z0-9 ]*"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
          pattern="[A-Za-z0-9 ]*"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={formState.status}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="to-do">To-Do</option>
          <option value="on progress">On Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
