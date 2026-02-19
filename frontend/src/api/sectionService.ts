import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export async function getSections(bookId: string) {
  const response = await axiosInstance.get(ROUTES.SECTIONS.GET_BY_BOOK(bookId));
  return response;
}

export async function createSection(
  bookId: string,
  data: { title: string; description: string },
) {
  const response = await axiosInstance.post(
    ROUTES.SECTIONS.CREATE(bookId),
    data,
  );
  return response;
}

export async function editSection(
  sectionId: string,
  data: { title?: string; description?: string },
) {
  const response = await axiosInstance.patch(
    ROUTES.SECTIONS.EDIT(sectionId),
    data,
  );
  return response;
}

export async function deleteSection(sectionId: string) {
  const response = await axiosInstance.delete(
    ROUTES.SECTIONS.DELETE(sectionId),
  );
  return response;
}
