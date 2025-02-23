import { Question, Form } from './types';
import { getFormFromDB, saveFormToDB } from './db';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const saveQuestion = async (question: Question): Promise<Question> => {
  const form = await getForm();
  const questionIndex = form.questions.findIndex((q) => q.id === question.id);

  if (questionIndex >= 0) {
    form.questions[questionIndex] = question;
  } else {
    form.questions.push(question);
  }

  await saveFormToDB(form);
  return question;
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  await delay(Math.random() * 1000 + 500);
  const form = await getForm();
  form.questions = form.questions.filter((q) => q.id !== questionId);
  await saveFormToDB(form);
};

export const getForm = async (): Promise<Form> => {
  return getFormFromDB();
};

export const saveForm = async (form: Form): Promise<Form> => {
  return saveFormToDB(form);
};
