import { QuestionOption } from "../interfaces/questionOptionInterface";

interface QuestionCardProps {
    question_option: QuestionOption;
}

export default function QuestionCard({ question_option }: QuestionCardProps) {
    return (
        <button
            className="bg-white w-full max-w-xs h-80 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out z-0 hover:z-10 rounded-sm"
        >
            {/* Imagen con texto superpuesto */}
            <div className="relative w-full h-48">
                <img
                    src={question_option.image}
                    alt={question_option.text}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-end">
                    <h3 className="text-white text-4xl font-bold text-center px-16 py-4">
                        {question_option.text}
                    </h3>
                </div>
            </div>
            {/* Descripción */}
            <div className="p-4 flex-grow overflow-hidden">
                <p className="text-gray-700 text-xs flex flex-col justify-center">
                    {question_option.description}
                </p>
            </div>
        </button>
    );
}