
import * as SelectPrimitive from "@radix-ui/react-select"

import { SelectTrigger } from "./select-trigger"
import { SelectContent } from "./select-content"
import { SelectItem } from "./select-item"
import { SelectLabel } from "./select-label"
import { SelectSeparator } from "./select-separator"
import { SelectScrollUpButton, SelectScrollDownButton } from "./select-scroll-buttons"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
