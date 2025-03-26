interface SidebarProps {
    userName: string;
    selectedAnswers: Array<{ 
        questionId: number, 
        optionId: number,
        text: string,
        image: string
    }>;
    //totalQuestions: number;
    onReset: () => void;
}

export default function Sidebar({ userName, selectedAnswers, onReset }: SidebarProps) {
    //const allQuestionsAnswered = selectedAnswers.length >= totalQuestions;
    const hasSelections = selectedAnswers.length > 0;

    const handleResetClick = () => {
        if (hasSelections && window.confirm('¿Estás seguro de que quieres reiniciar el cuestionario? Perderás todas tus selecciones actuales.')) {
            onReset();
        }
    }

    return (
        <div className='h-screen bg-white shadow-lg transition-all duration-300 ease-in-out w-80'>
            <div className="px-6 py-4 h-full overflow-y-auto flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hola, {userName}</h2>
                <p className="text-gray-600 mb-4">Estas son tus preferencias:</p>

                {/* Lista de preferencias seleccionadas */}
                <div className="space-y-3 w-4/5 mx-auto flex-grow"> {/* 80% del ancho del sidebar */}
                {selectedAnswers.length > 0 ? (
                    selectedAnswers.map((answer) => (
                        <div key={`${answer.questionId}-${answer.optionId}`} className="relative w-full h-12 rounded-lg overflow-hidden">
                            <img 
                                src={answer.image} 
                                alt={answer.text} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <p className="text-white text-sm font-medium text-center px-2">
                                    {answer.text}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic">
                        No has seleccionado ninguna preferencia todavía.
                    </p>
                )}
                </div>

                <div className="mt-4 mb-12">
                    <button
                        onClick={handleResetClick}
                        className={`w-full block text-center py-3 rounded-lg text-white font-medium transition-colors ${
                            hasSelections 
                            ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        disabled={!hasSelections}
                    >
                        {hasSelections ? 'Reiniciar cuestionario' : 'No hay selecciones'}
                    </button>

                    {/* <Link 
                        to="/results" 
                        className={`w-full block text-center py-3 rounded-lg text-white font-medium transition-colors ${
                            allQuestionsAnswered 
                            ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        onClick={(e) => !allQuestionsAnswered && e.preventDefault()}
                        aria-disabled={!allQuestionsAnswered}
                    >
                        {allQuestionsAnswered ? 'Ver mis resultados' : `Faltan ${totalQuestions - selectedAnswers.length} preguntas`}
                    </Link> */}
                </div>
            </div>
        </div>
    )
}