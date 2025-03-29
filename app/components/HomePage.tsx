import { User } from "~/interfaces/userInterface";
import Button from "./Button";

interface HomePageProps {
    user: User | null;
}

export default function HomePage({ user }: HomePageProps) {
  return (
      <div className="absolute top-1/2 right-10 transform -translate-y-1/2 bg-white p-6 rounded-r-sm shadow-lg max-w-md">
        <p className="text-blue-600 text-lg font-semibold">
          🌍 En el corazón de los viajes
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-2">
          Descubre tu próximo destino con Amadeus
        </h2>
        <p className="text-gray-700 mt-4">
          La tecnología de Amadeus transforma la industria de los viajes y el
          turismo en todo el mundo, ayudándote a encontrar el destino perfecto
          para tus vacaciones.
        </p>
        <p className="text-gray-700 mt-4">
          ✈️ <strong>¿No sabes a dónde ir?</strong>
          <br />
          No te preocupes, nosotros te guiamos para que disfrutes una
          experiencia inolvidable.
        </p>
        <p className="text-gray-700 mt-4">
          Tu próxima aventura está a un clic de distancia.
        </p>
        <br />
        <Button
          to={user ? "/question" : "/login"}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {user ? "Comenzar cuestionario →" : "Vamos a viajar →"}
        </Button>
      </div>
  );
}
