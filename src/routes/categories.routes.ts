import { Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../models/Category';

import CreateUserService from '../services/CreateCategoriesService';

const categoriesRouter = Router();

categoriesRouter.get('/', async (request, response) => {
  const categoriesRepository = getRepository(Category);

  const categories = await categoriesRepository.find();

  return response.json(categories);
});

categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    title,
  });

  return response.json(user);
});

export default categoriesRouter;
