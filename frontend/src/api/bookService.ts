import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export async function getBooks() {
  const response = await axiosInstance.get(ROUTES.BOOKS.GET_ALL);
  return response;
}

export async function getBook(bookId: string) {
  const response = await axiosInstance.get(ROUTES.BOOKS.GET_ONE(bookId));
  return response;
}

export async function createBook(data: {
  title: string;
  description: string;
  color: string;
}) {
  const response = await axiosInstance.post(ROUTES.BOOKS.CREATE, data);
  return response;
}

export async function editBook(
  bookId: string,
  data: { title?: string; description?: string; color?: string },
) {
  const response = await axiosInstance.patch(ROUTES.BOOKS.EDIT(bookId), data);
  return response;
}

export async function deleteBook(bookId: string) {
  const response = await axiosInstance.delete(ROUTES.BOOKS.DELETE(bookId));
  return response;
}
