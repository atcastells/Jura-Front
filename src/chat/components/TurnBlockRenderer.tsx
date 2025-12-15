import type { TurnBlock } from "../types";
import { MarkdownViewer } from "@/shared";

interface TurnBlockRendererProps {
  block: TurnBlock;
}

export const TurnBlockRenderer = ({ block }: TurnBlockRendererProps) => {
  switch (block.type) {
    case "text": {
      const textData = block.data as { content: string };
      return (
        <div className="rounded-lg bg-neutral-50 p-4">
          <MarkdownViewer content={textData.content} />
        </div>
      );
    }

    case "cv-upload-prompt": {
      const uploadData = block.data as { acceptedFormats: string[] };
      return (
        <div className="rounded-lg border-2 border-dashed border-neutral-300 bg-white p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl">📄</span>
          </div>
          <h4 className="mb-2 text-sm font-medium text-neutral-900">
            Upload Your CV
          </h4>
          <p className="mb-4 text-xs text-neutral-600">
            Accepted formats: {uploadData.acceptedFormats.join(", ")}
          </p>
          <button
            className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed"
            disabled
            title="CV upload coming soon"
          >
            Choose File
          </button>
          <p className="mt-3 text-xs text-neutral-500">
            Or continue manually by typing your response
          </p>
        </div>
      );
    }

    case "profile-basics-prompt": {
      const basicsData = block.data as {
        fields: string[];
        existingData?: Record<string, string>;
      };
      return (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium text-neutral-900">
            Basic Information
          </h4>
          <div className="space-y-2 text-xs text-neutral-600">
            {basicsData.fields.map((field) => {
              const value = basicsData.existingData?.[field];
              return (
                <div key={field} className="flex items-center justify-between">
                  <span className="capitalize">
                    {field.replace(/([A-Z])/g, " $1")}:
                  </span>
                  <span
                    className={
                      value
                        ? "text-primary-600 font-medium"
                        : "text-neutral-400"
                    }
                  >
                    {value || "Not set"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-neutral-500 italic">
            You can update these fields by typing your information in the
            message box below
          </p>
        </div>
      );
    }

    case "role-prompt": {
      const roleData = block.data as {
        roleIndex?: number;
        existingRole?: Record<string, unknown>;
      };
      return (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium text-neutral-900">
            Role #{(roleData.roleIndex || 0) + 1}
          </h4>
          <p className="text-xs text-neutral-600">
            Tell me about your job title, company, dates, and key achievements
          </p>
        </div>
      );
    }

    case "confirmation": {
      const confirmData = block.data as {
        action: string;
        details: Record<string, unknown>;
        confirmed: boolean;
      };
      return (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-primary-900">
            {confirmData.action}
          </h4>
          <div className="text-xs text-primary-700">
            {Object.entries(confirmData.details).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1")}:
                </span>{" "}
                {String(value)}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 rounded bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600"
              disabled
            >
              Confirm
            </button>
            <button
              className="flex-1 rounded bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              disabled
            >
              Edit
            </button>
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="rounded-lg bg-neutral-100 p-3 text-xs text-neutral-500">
          Unknown block type: {block.type}
        </div>
      );
  }
};
