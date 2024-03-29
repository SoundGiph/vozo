import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { DropzoneState, FileWithPath } from "react-dropzone";
import { useForm, UseFormReturn } from "react-hook-form";
import { Stages } from "../../constants/constants";
import { useVozoApp } from "../../context/useVozoApp.hook";
import { useApi } from "../../hooks/api/useApi.hook";
import { useNotification } from "../../hooks/notification/useNotification";
import { CREATE_VOZO_MODAL_ID } from "./CreateVozoModal";
import { useCreateVozoModalDropZone } from "./useCreateVozoModalDropZone";

export enum StepsToAddVozo {
  UPLOAD_AUDIO = 1,
  ADD_DESCRIPTION = 2,
  UPLOAD_IMAGE = 3,
  SUCCESS = 4,
}

export enum CreateVozoFormFields {
  TITLE = "title",
  DESCRIPTION = "description",
  AUDIO_FILE = "audioFile",
  IMAGE_FILE = "imageFile",
}

export interface CreateVozoForm {
  imageFile: FileWithPath;
  audioFile: FileWithPath;
  title: string;
  description: string;
  userId: string;
}

interface UseCreateVozoFormOutput {
  onSubmit: (data: CreateVozoForm) => void;
  dropZoneAudioState: DropzoneState;
  dropZoneImageState: DropzoneState;
  steps: number;
  form: UseFormReturn<CreateVozoForm>;
  onPressValidateTitleAndDescriptions: () => void;
  onPushGoBack: () => void;
}

export const useCreateVozoForm = (): UseCreateVozoFormOutput => {
  const [steps, setSteps] = useState<StepsToAddVozo>(StepsToAddVozo.UPLOAD_AUDIO);
  const { createSoundGifToApprove } = useApi(Stages.BUILD);
  const { currentUser } = useVozoApp();
  const form = useForm<CreateVozoForm>();
  form.register("audioFile", { required: true });
  form.register("imageFile", { required: true });
  const [cookies] = useCookies(["access_token"]);

  const dropZoneAudioState = useCreateVozoModalDropZone({
    onDrop: () => undefined,
    accept: {
      "audio/aac": [".aac"],
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
    },
  });

  const { acceptedFiles: acceptedAudioFile } = dropZoneAudioState;

  const dropZoneImageState = useCreateVozoModalDropZone({
    onDrop: () => undefined,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
  });
  const { acceptedFiles: acceptedImageFile } = dropZoneImageState;

  useEffect(() => {
    if (acceptedAudioFile[0]) {
      console.log("FILE", acceptedAudioFile);
      form.setValue("audioFile", acceptedAudioFile[0]);
      setSteps(StepsToAddVozo.ADD_DESCRIPTION);
    }
  }, [acceptedAudioFile]);

  useEffect(() => {
    if (acceptedImageFile[0]) {
      form.setValue("imageFile", acceptedImageFile[0], { shouldValidate: true });
    }
  }, [acceptedImageFile]);

  useEffect(() => {
    if (steps === StepsToAddVozo.SUCCESS) {
      form.reset({
        audioFile: undefined,
        imageFile: undefined,
        title: undefined,
        description: undefined,
        userId: undefined,
      });
      setSteps(StepsToAddVozo.UPLOAD_AUDIO);
    }
  }, [steps, form]);

  const { notificationSuccess } = useNotification();
  const onSubmit = async (payload: CreateVozoForm) => {
    const userId = currentUser?.id as string;
    const { title, description, imageFile, audioFile } = payload;
    const isVozoCreated = await createSoundGifToApprove(
      {
        title,
        description,
        imageFile,
        audioFile,
        userId,
      },
      cookies.access_token
    );
    if (window.document) {
      window.document?.getElementById(CREATE_VOZO_MODAL_ID)?.click();
      notificationSuccess("Votre Vozo est en cours de création, il sera uploadé une fois approuvé par notre équipe");
      setSteps(StepsToAddVozo.SUCCESS);
    }
  };

  const onPressValidateTitleAndDescriptions = () => {
    if (steps === StepsToAddVozo.ADD_DESCRIPTION) {
      setSteps(StepsToAddVozo.UPLOAD_IMAGE);
    }
  };

  const onPushGoBack = () => {
    if (steps === StepsToAddVozo.ADD_DESCRIPTION) form.reset();
    if (steps === StepsToAddVozo.UPLOAD_IMAGE) form.resetField("imageFile");
    setSteps(previousSteps => previousSteps - 1);
  };

  return {
    onPressValidateTitleAndDescriptions,
    dropZoneImageState,
    onSubmit,
    dropZoneAudioState,
    steps,
    form,
    onPushGoBack,
  };
};

