import useSWR, { mutate } from "swr";
import { uploadToCloudinary } from "../../utils/CloudinaryConfige";
import { showToast } from "@repo/ui/components/ui/toaster";
import { getErrorMessage } from "../../utils/getErrorMessage";

export function useImageUpload() {
  const { data: uploadState, isLoading, isValidating } = useSWR("uploadState", null, { revalidateOnFocus: false });

  const uploadImages = async (files: File[]) => {
    try {
      mutate("uploadState", { isUploading: true }, false);
      const urls = await uploadToCloudinary(files);
      mutate("uploadState", { isUploading: false }, false);
      return urls;
    } catch (error) {
      showToast(getErrorMessage(error));
      mutate("uploadState", { isUploading: false }, false);
      return [];
    }
  };

  return { uploadImages, uploadState, isLoading, isValidating };
}
