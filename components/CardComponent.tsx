import { Card } from "./Card";

function CardComponent({ card, onEdit, onDelete }: { card: Card; onEdit: (id: string) => void; onDelete: (id: string) => void }) {
    return (
      <div className="border p-4 rounded shadow-sm bg-gray-100" key={card.description}>
        <h3 className="text-lg font-bold">{card.name}</h3>
        <p className="text-sm">{card.description}</p>
        <span className="block text-xs font-medium text-gray-600">Status: {card.status}</span>
        <div className="flex gap-2 mt-2">
          <button className="text-blue-500" onClick={() => onEdit(card.id)}>
            Edit
          </button>
          <button className="text-red-500" onClick={() => onDelete(card.id)}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  export default CardComponent