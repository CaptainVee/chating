import hashlib

def create_room_name(user_id, to_user_id):
  """
  Creates a unique and deterministic room name based on sorted user IDs.

  Args:
      user_id: ID of the first user.
      to_user_id: ID of the second user.

  Returns:
      A unique room name string.
  """

  # Sort user IDs in ascending order
  sorted_ids = sorted([int(user_id), int(to_user_id)])
  combined_ids = f"{sorted_ids[0]}-{sorted_ids[1]}"

  # Generate a unique room name hash
  room_name = hashlib.sha256(combined_ids.encode()).hexdigest()

  return room_name
