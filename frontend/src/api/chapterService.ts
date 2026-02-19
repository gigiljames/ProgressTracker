import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export async function getChapters(sectionId: string) {
  const response = await axiosInstance.get(
    ROUTES.CHAPTERS.GET_BY_SECTION(sectionId),
  );
  return response;
}

export async function createChapter(
  sectionId: string,
  data: { title: string; description: string },
) {
  const response = await axiosInstance.post(
    ROUTES.CHAPTERS.CREATE(sectionId),
    data,
  );
  return response;
}

export async function editChapter(
  chapterId: string,
  data: { title?: string; description?: string },
) {
  const response = await axiosInstance.patch(
    ROUTES.CHAPTERS.EDIT(chapterId),
    data,
  );
  return response;
}

export async function deleteChapter(chapterId: string) {
  const response = await axiosInstance.delete(
    ROUTES.CHAPTERS.DELETE(chapterId),
  );
  return response;
}
