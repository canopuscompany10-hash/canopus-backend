import express from "express";
import {
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  editCategory,
  getCategories,
  getMenuItemById,
  getMenuItems,
  updateMenuItem,
  createCategory,
} from "../controller/Menu.controller.js";

const MenuRouter = express.Router();

// ------------------------
// Category Routes (must be first)
// ------------------------
MenuRouter.get("/categories", getCategories);           
MenuRouter.post("/categories", createCategory);         
MenuRouter.put("/categories/:oldCategory", editCategory); 
MenuRouter.delete("/categories/:category", deleteCategory); 

// ------------------------
// Menu Item Routes
// ------------------------
MenuRouter.get("/", getMenuItems);               
MenuRouter.get("/:id", getMenuItemById);         
MenuRouter.post("/", createMenuItem);            
MenuRouter.put("/:id", updateMenuItem);          
MenuRouter.delete("/:id", deleteMenuItem);       

export default MenuRouter;
