import { saveQuestion, deleteQuestion, getForm, saveForm } from '@/lib/store';
import { getFormFromDB, saveFormToDB } from '@/lib/db';
import { Form, Question } from '@/lib/types';

jest.mock('@/lib/db', () => ({
  getFormFromDB: jest.fn(),
  saveFormToDB: jest.fn(),
}));

let mockForm = {
  id: 'default',
  title: 'Test Form',
  questions: [
    {
      id: '1',
      title: 'Question 1',
      type: 'text',
      required: false,
      hidden: false,
    },
  ],
} as Form;

describe('Store Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mockForm to initial state
    mockForm = {
      id: 'default',
      title: 'Test Form',
      questions: [
        {
          id: '1',
          title: 'Question 1',
          type: 'text',
          required: false,
          hidden: false,
        },
      ],
    };
    (getFormFromDB as jest.Mock).mockImplementation(() =>
      Promise.resolve({ ...mockForm }),
    );
    (saveFormToDB as jest.Mock).mockImplementation((form) =>
      Promise.resolve(form),
    );
  });

  describe('saveQuestion', () => {
    it('should add a new question when it does not exist', async () => {
      const newQuestion = {
        id: '2',
        title: 'New Question',
        type: 'text',
        required: false,
        hidden: false,
      } as Question;

      await saveQuestion(newQuestion);

      const expectedForm = {
        ...mockForm,
        questions: [...mockForm.questions, newQuestion],
      };

      expect(saveFormToDB).toHaveBeenCalledWith(expectedForm);
    });

    it('should update existing question', async () => {
      const updatedQuestion = {
        ...mockForm.questions[0],
        title: 'Updated Question',
      };

      await saveQuestion(updatedQuestion);

      const expectedForm = {
        ...mockForm,
        questions: [updatedQuestion],
      };

      expect(saveFormToDB).toHaveBeenCalledWith(expectedForm);
    });
  });

  describe('deleteQuestion', () => {
    it('should remove a question from the form', async () => {
      await deleteQuestion('1');

      const expectedForm = {
        ...mockForm,
        questions: [],
      };

      expect(saveFormToDB).toHaveBeenCalledWith(expectedForm);
    });
  });

  describe('getForm', () => {
    it('should return the form from DB', async () => {
      const form = await getForm();
      expect(form).toEqual(mockForm);
      expect(getFormFromDB).toHaveBeenCalled();
    });
  });

  describe('saveForm', () => {
    it('should save the entire form', async () => {
      const newForm = {
        ...mockForm,
        title: 'Updated Form',
      };

      await saveForm(newForm);
      expect(saveFormToDB).toHaveBeenCalledWith(newForm);
    });
  });
});
