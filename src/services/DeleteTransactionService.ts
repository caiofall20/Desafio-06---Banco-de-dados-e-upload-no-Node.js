import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const user = await transactionRepository.findOne(id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }
    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
