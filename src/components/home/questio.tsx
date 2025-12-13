import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/strore";
import { addQuestion, addAnswer } from "../../reducers/questionSlice";
import signalRService from "../../services/signalRService";

const QuestionAdminPanel: React.FC = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.questions.questions);
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});

useEffect(() => {
  const init = async () => {
    try {
      // اگر هنوز کانکشن ساخته نشده، بساز و استارت کن
      if (!signalRService.connection) {
        await signalRService.connect();
      }

      // پاک کردن handlerهای قبلی (در صورت وجود)
      signalRService.connection?.off("ReceiveQuestion");
      signalRService.connection?.off("ReceiveAnswer");

      // اضافه کردن handlerهای جدید
      signalRService.connection?.on("ReceiveQuestion", (data: any) => {
        dispatch(addQuestion(data));
      });

      signalRService.connection?.on("ReceiveAnswer", (data: any) => {
        const { questionId, answer } = data;
        setAnswersMap(prev => ({ ...prev, [questionId]: answer }));
        dispatch(addAnswer({ questionId, answer }));
      });
    } catch (err) {
      console.error("Error initializing SignalR:", err);
    }
  };

  init();
}, [dispatch]);


  const handleAnswer = async (question: any) => {
    const answer = prompt("پاسخ خود را وارد کنید:");
    if (!answer) return;

    try {
      await signalRService.sendAnswer(question.questionId, question.userId, answer);
      setAnswersMap(prev => ({ ...prev, [question.questionId]: answer }));
    } catch (error) {
      console.error("Error sending answer:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-2xl font-bold text-center text-red-600 mb-4">پنل مدیریت سوال‌ها</h1>

      {questions.length === 0 && <p className="text-center text-gray-500">هیچ سوالی دریافت نشده</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-center border-b border-gray-300">ردیف</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">کاربر</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">سوال</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">پاسخ</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr
                key={`${q.questionId}-${idx}`} // تضمین uniqueness key
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
              >
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{q.userId}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{q.text}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  {answersMap[q.questionId] || "هنوز پاسخ داده نشده"}
                </td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <button
                    onClick={() => handleAnswer(q)}
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
                  >
                    پاسخ دادن
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionAdminPanel;
