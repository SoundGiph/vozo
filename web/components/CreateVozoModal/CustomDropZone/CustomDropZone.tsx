import { useTranslation } from "next-i18next";
import Dropzone, { DropzoneState } from "react-dropzone";
import { DynamicIcon } from "../../DynamicIcon/DynamicIcon";


interface CustomDropZoneProps {
  dropZoneState: DropzoneState;
  dropZoneType: DropZoneType;
}

export enum DropZoneType {
  AUDIO = "audio",
  IMAGE = "image"
}

export const CustomDropZone: React.FC<CustomDropZoneProps> = ({ dropZoneState, dropZoneType }) => {
  const { t } = useTranslation();
  const { getInputProps, getRootProps } = dropZoneState;
  return (
    <Dropzone>
      {() => (
        <section>
          <div
            {...getRootProps()}
            className="flex border-2 border-dashed border-primary justify-around items-center w-full h-2/6 bg-neutral p-5 rounded-xl flex-col"
          >
            <input {...getInputProps()} />
            <DynamicIcon icon="fa upload" color="#6565F1" size="2x" />
            {
              dropZoneType === DropZoneType.AUDIO ?
                (
                  <p className="mt-4">
                    <>{t("create_vozo_modal.drop_box.audio.label")}</>
                  </p>
                ) : <></>
            }
            {
              dropZoneType === DropZoneType.IMAGE ?
                (
                  <p className="mt-4">
                    <>{t("create_vozo_modal.drop_box.image.label")}</>
                  </p>
                ) : <></>
            }
          </div>
        </section>
      )}
    </Dropzone>
  );
};

