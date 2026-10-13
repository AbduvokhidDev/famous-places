import client from "./client";

export const getComments = async (placeId) => {
  const res = await client.get(`/api/places/${placeId}/comments`);
  return res.data.data;
};

export const addComment = async (placeId, text, parentId = null) => {
  const res = await client.post(`/api/places/${placeId}/comments`, {
    text,
    parentId,
  });
  return res.data.data;
};

export const deleteComment = async (id) => {
  await client.delete(`/api/comments/${id}`);
};

export const syncUser = async (profile) => {
  const res = await client.post("/api/users/sync", profile);
  return res.data.data;
};
