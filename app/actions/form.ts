"use server";

export async function saveForm(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const fieldsJson = formData.get("fields") as string;
  const fields = JSON.parse(fieldsJson);

  // Here you could save to a database
  return { success: true, message: "Form saved successfully!" };
}
