import { z } from "zod"
import { CANNOT_BE_EMPTY } from "./validation-messages"

export const CreateTransactionImageSchema = z.object({
  path: z.string(),
  title: z.string(),
  transactionId: z.string().uuid(),
})

export type CreateTransactionImageType = z.infer<
  typeof CreateTransactionImageSchema
>

export const CreateTransactionImageFormSchema = z.object({
  files: z
    .custom<FileList>()
    .refine((files) => files.length > 0, "No file selected.")
    .refine((files) => files.length === 1, "Please select only a single file.")
    .refine(
      (files) =>
        Array.from(files).every(
          (file) =>
            file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/jpeg"
        ),
      "Invalid file type."
    ),
  title: z.string().min(1, CANNOT_BE_EMPTY),
  transactionId: z.string().uuid(),
})

export type CreateTransactionImageFormType = z.infer<
  typeof CreateTransactionImageFormSchema
>

export const DeleteTransactionImageSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteTransactionImageType = z.infer<
  typeof DeleteTransactionImageSchema
>

const SupportedUploadSchema = z.union([
  z.literal("image/png"),
  z.literal("image/jpg"),
  z.literal("image/jpeg"),
])

export type SupportedUploadType = z.infer<typeof SupportedUploadSchema>

export const GetUploadUrlSchema = z.object({
  fileType: SupportedUploadSchema,
  byteLength: z.number().nonnegative(),
})

export type GetUploadUrlType = z.infer<typeof GetUploadUrlSchema>
