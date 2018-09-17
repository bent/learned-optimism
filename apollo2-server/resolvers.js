 const { Adversity, Belief, Evidence, Alternative, Implication } = require("./connectors")

const resolvers = {
  Query: {
    getAllTodos() {
      return Adversity.findAll();
    },
    getTodo(_, args) {
      return Adversity.findById(args.id)
    }
  },
  Todo: {
    subtasks(todo) {
      return todo.getBeliefs();
    }
  },
  Subtask: {
    todo(subtask) {
      return subtask.getAdversity()
    }
  },
  Mutation: {
    createTodo(_, {description}) {
      return Adversity.create({description})
    },
    deleteTodo(_, {id}) {
      return Adversity.destroy({where: {id}}).then(() => {id})
    },
    createSubtask(_, {todoId, description}) {
      return Belief.create({adversityId: todoId, description})
    },
    deleteSubtask(_, {id}) {
      return Belief.destroy({where: {id}}).then(() => {id})
    }
  }
};

module.exports = resolvers;