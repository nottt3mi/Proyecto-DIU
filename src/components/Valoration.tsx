import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addReview } from "@/contexts/AuthContext"; 

const ReviewForm = ({ workerId }: { workerId: string }) => {
  const { user } = useAuth();
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addReview(workerId, user.id, estrellas, comentario);
    setComentario("");
    alert("Reseña enviada con éxito ✅");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Calificación (1-5)</label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={estrellas} 
          onChange={(e) => setEstrellas(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Comentario</label>
        <textarea 
          value={comentario} 
          onChange={(e) => setComentario(e.target.value)} 
          placeholder="Escribe tu reseña..."
        />
      </div>
      <button type="submit">Enviar Reseña</button>
    </form>
  );
};
