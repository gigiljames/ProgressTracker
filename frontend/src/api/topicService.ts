import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export async function getTopics(chapterId: string) {
  const response = await axiosInstance.get(
    ROUTES.TOPICS.GET_BY_CHAPTER(chapterId),
  );
  return response;
}

export async function createTopic(
  chapterId: string,
  data: { title: string; description: string },
) {
  const response = await axiosInstance.post(
    ROUTES.TOPICS.CREATE(chapterId),
    data,
  );
  return response;
}

export async function editTopic(
  topicId: string,
  data: { title?: string; description?: string },
) {
  const response = await axiosInstance.patch(ROUTES.TOPICS.EDIT(topicId), data);
  return response;
}

export async function deleteTopic(topicId: string) {
  const response = await axiosInstance.delete(ROUTES.TOPICS.DELETE(topicId));
  return response;
}

export async function toggleTopic(topicId: string) {
  const response = await axiosInstance.patch(ROUTES.TOPICS.TOGGLE(topicId));
  return response;
}
