import {DynamoTable, DYNAMO_TABLE, Feedback} from "ailog-common";

const table = DynamoTable(DYNAMO_TABLE.NAME);
export const putFeedback = async (username: string, feedback: Feedback) => {
  return table.put({
    hashKey: username,
    sortKey: `feedback_${Date.now()}`
  }, feedback);
}