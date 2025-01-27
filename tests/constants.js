import { faker } from '@faker-js/faker';

export const userCreds = {
    username: faker.internet.username(),
    password: faker.internet.password(),
}

export const userData = {
    'Email': faker.internet.email(),
    'First name': faker.person.firstName(),
    'Last name': faker.person.lastName(),
}

export const labelData = {
    'Name': faker.lorem.word(6)
}

export const statusData = {
    'Name': faker.lorem.word(5),
    'Slug': faker.lorem.word(5)
}

export const taskData = {
  assignee: 'sarah@example.com',
  title: faker.lorem.word(6),
  content: faker.lorem.word(8),
  status: 'To Review',
  label: 'task'
}

export const itemCount = {
    user: 8,
    label: 5,
    status: 5,
    task: 15
}

export const taskStatus = {
  draft: 'Draft',
  toReview: 'To Review',
  toBeFixed: 'To Be Fixed',
  toPublish: 'To Publish',
  published: 'Published'
}

export const taskCountWithStatus = {
  draft: 3,
  toReview: 3,
  toBeFixed: 3,
  toPublish: 3,
  published: 3
}