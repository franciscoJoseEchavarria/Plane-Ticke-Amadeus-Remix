import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
// Import components
import QuestionCard from '../components/QuestionCard';
// Import services
import questionService from '~/services/questionService';
import questionOptionService from '~/services/questionOptionService';
// Import interfaces
import type { Question } from '~/interfaces/questionInterface';
import { QuestionOption } from '../interfaces/questionOptionInterface';

export const loader: LoaderFunction = async () => {
    try {
        const question = await questionService.getQuestions();
        const questionOption = await questionOptionService.getQuestionOptions();

        if (!question || !questionOption) {
            throw new Response("No se encontraron datos", { status: 404 });
        }

        return json({ question, questionOption });
    } catch (error) {
        console.error("Error en el loader:", error);
        throw new Response("Error al cargar los datos", { status: 500 });
    }
};

export default function Question() {

    const { question, questionOption } = useLoaderData<{ question: Question[], questionOption: QuestionOption[] }>();

    const firstQuestion = question[0];
    console.log(firstQuestion);

    const optionsForFirstQuestion = questionOption.filter(
        (option: QuestionOption) => option.questionId === firstQuestion.id
    );

    console.log("firstQuestion.Id:", firstQuestion.id, "type:", typeof firstQuestion.id);
    console.log("QuestionIds in options:", questionOption.map(opt => ({ 
        id: opt.questionId, 
        type: typeof opt.questionId 
    })));

    return (
        <div className='bg-blue-200 h-screen'>
            <h2 className="text-center text-gray-800 text-4xl pt-10">{firstQuestion.text}</h2>
            <div className="flex justify-center space-x-4 pt-4 m-6">
                {/* Renderiza las opciones asociadas */}
                {optionsForFirstQuestion.map((option: QuestionOption) => (
                    <QuestionCard question_option={option} key={option.id} />
                ))}
            </div>
        </div>
    )
}