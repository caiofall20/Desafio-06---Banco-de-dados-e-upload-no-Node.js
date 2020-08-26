import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateUserService from './CreateCategoriesService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: Category;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new AppError('Valor excedido', 400);
    }

    const verifyTitleCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (verifyTitleCategory) {
      const category_id = verifyTitleCategory;

      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category: category_id,
      });
      await transactionRepository.save(transaction);
      return transaction;
    }

    const createUser = new CreateUserService();
    await createUser.execute({
      title: category.title,
    });

    const verifyTitleCategory2 = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: verifyTitleCategory2,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
