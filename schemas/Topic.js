const { Schema, model } = require("mongoose");

const topicSchema = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    topic_title: { type: String, required: true },
    topic_text: { type: String, required: true },
    created_date: { type: Date },
    updated_date: { type: Date },
    is_checked: { type: Boolean },
    is_approved: { type: Boolean },
    expert_id: { type: Schema.Types.ObjectId, ref: "Author" },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = model("Topic", topicSchema);
