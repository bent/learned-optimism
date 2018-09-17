module.exports = `
  type Todo {
    id: ID!

    description: String!
    subtasks: [Subtask!]!
  }

  type Subtask {
    id: ID!

    description: String!
    todo: Todo!
  }

  type Query {
    getAllTodos: [Todo!]!
    getTodo(id: ID): Todo!
  }

  type Mutation {
    createTodo(description: String!): Todo
    deleteTodo(id: ID!): Todo
    createSubtask(todoId: ID!, description: String!): Subtask
    deleteSubtask(id: ID!): Subtask
  }
`