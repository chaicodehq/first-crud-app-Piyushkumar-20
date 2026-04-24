import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const newTodo = await Todo.create(req.body);
    return res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const { page = 1, limit = 10, completed, priority, search } = req.query;
    const query = {};

    if (completed !== undefined) query.completed = req.query.completed === "true"
    if (priority) query.priority = priority
    if (search) query.title = { $regex: search, $options: "i" }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    const [todos, total] = await Promise.all([
      Todo.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum), Todo.countDocuments(query)
    ])

    res.json({
      data: todos,
      meta: {
        total,
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    })

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found"
        }
      })
    }
    res.json(todo)
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {

    const { id } = req.params
    const todo = await Todo.findByIdAndUpdate(id, req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found"
        }
      })
    }
    res.json(todo)

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found"
        }
      })
    }

    todo.completed = !todo.completed;

    await todo.save();
    res.json(todo);

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here

    const todo = await Todo.findByIdAndDelete(req.params.id)
        if (!todo) {
      return res.status(404).json({
        error: {
          message: "Todo not found"
        }
      })
    }
    res.status(204).send()


  } catch (error) {
    next(error);
  }
}
