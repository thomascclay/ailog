import {DynamoTable} from "./dynamo";
import {DYNAMO_TABLE, Feedback} from "ailog-common";

const table = DynamoTable(DYNAMO_TABLE.NAME);
export const putFeedback = async (feedback: Feedback) => {
  await table.put({
    hashKey: 'test-thomas',
    sortKey: (new Date()).toISOString()
  }, feedback);
}