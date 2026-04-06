import {z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, InputGroup, Description, Spinner } from "@heroui/react";
import { HugeiconsIcon} from "@hugeicons/react"
import {MailAccount02Icon, ViewIcon, ViewOffSlashIcon, LockKeyIcon, Login02Icon} from "@hugeicons/core-free-icons"
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "react-i18next";



const CreateDishForm = () => {
  return (
    <div>CreateDishForm</div>
  )
}

export default CreateDishForm