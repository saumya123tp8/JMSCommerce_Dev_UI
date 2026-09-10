import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  customizationFormSchema,
  type CustomizationFormValues,
} from "@/schema/customization";
import type { CustomizationRequest } from "@/types/customization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Props {
  value: CustomizationRequest;
  onChange: (value: CustomizationRequest) => void;
}

const emptyOption = {
  name: "",
  adjustmentType: "FIXED" as const,
  adjustmentValue: 0,
  displayOrder: 1,
};

const emptyGroup = {
  name: "",
  selectionType: "SINGLE" as const,
  required: false,
  minSelection: 0,
  maxSelection: 1,
  displayOrder: 1,
  options: [emptyOption],
};

// Controlled wrapper around react-hook-form's useFieldArray so this
// can live inside a larger uncontrolled form (AdminProductForm)
// without submitting on its own — every change is pushed up via
// onChange, and the parent decides when/how to use the data
// (staged now, submitted later once the product is ACTIVE).
const CustomizationGroupsEditor: React.FC<Props> = ({ value, onChange }) => {
  const form = useForm<CustomizationFormValues>({
    resolver: zodResolver(customizationFormSchema),
    defaultValues: value.groups.length > 0 ? { groups: value.groups } : { groups: [emptyGroup] },
  });

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({ control: form.control, name: "groups" });

  // Push every change up to the parent as it happens, so the
  // staged/submitted payload always reflects the current form state
  // without requiring its own submit button.
  useEffect(() => {
    const subscription = form.watch((formValue) => {
      const groups = (formValue.groups ?? []).filter(
        (g): g is NonNullable<typeof g> => Boolean(g)
      );
      onChange({ groups: groups as CustomizationRequest["groups"] });
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  return (
    <div className="space-y-6">
      {groupFields.map((group, groupIndex) => (
        <div key={group.id} className="rounded-lg border p-4">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Group name, e.g. Milk"
                {...form.register(`groups.${groupIndex}.name`)}
              />
            </div>
            {groupFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGroup(groupIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Selection type
              </label>
              <Select
                value={form.watch(`groups.${groupIndex}.selectionType`)}
                onValueChange={(val) =>
                  form.setValue(
                    `groups.${groupIndex}.selectionType`,
                    val as "SINGLE" | "MULTIPLE"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MULTIPLE">Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Min selection
              </label>
              <Input
                type="number"
                min={0}
                {...form.register(`groups.${groupIndex}.minSelection`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Max selection
              </label>
              <Input
                type="number"
                min={1}
                {...form.register(`groups.${groupIndex}.maxSelection`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="flex items-end gap-2 pb-2">
              <Switch
                checked={form.watch(`groups.${groupIndex}.required`)}
                onCheckedChange={(checked) =>
                  form.setValue(`groups.${groupIndex}.required`, checked)
                }
              />
              <label className="text-sm">Required</label>
            </div>
          </div>

          <OptionsEditor form={form} groupIndex={groupIndex} />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          appendGroup({ ...emptyGroup, displayOrder: groupFields.length + 1 })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add group
      </Button>
    </div>
  );
};

// Isolated so useFieldArray's `name` typing for nested options stays
// clean — one instance per group.
const OptionsEditor: React.FC<{
  form: ReturnType<typeof useForm<CustomizationFormValues>>;
  groupIndex: number;
}> = ({ form, groupIndex }) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `groups.${groupIndex}.options`,
  });

  return (
    <div className="space-y-2 border-t pt-3">
      <p className="text-xs font-medium text-muted-foreground">Options</p>
      {optionFields.map((option, optionIndex) => (
        <div key={option.id} className="flex items-center gap-2">
          <Input
            placeholder="Option name, e.g. Almond Milk"
            className="flex-1"
            {...form.register(
              `groups.${groupIndex}.options.${optionIndex}.name`
            )}
          />
          <Select
            value={form.watch(
              `groups.${groupIndex}.options.${optionIndex}.adjustmentType`
            )}
            onValueChange={(val) =>
              form.setValue(
                `groups.${groupIndex}.options.${optionIndex}.adjustmentType`,
                val as "FIXED" | "PERCENTAGE"
              )
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED">Fixed ₹</SelectItem>
              <SelectItem value="PERCENTAGE">Percent %</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="0.01"
            min={0}
            className="w-24"
            placeholder="0.00"
            {...form.register(
              `groups.${groupIndex}.options.${optionIndex}.adjustmentValue`,
              { valueAsNumber: true }
            )}
          />
          {optionFields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeOption(optionIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() =>
          appendOption({
            ...emptyOption,
            displayOrder: optionFields.length + 1,
          })
        }
      >
        <Plus className="mr-1 h-3 w-3" />
        Add option
      </Button>
    </div>
  );
};

export default CustomizationGroupsEditor;