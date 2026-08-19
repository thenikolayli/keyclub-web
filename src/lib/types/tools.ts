import type { Component } from "svelte";
import type { Role } from "$lib/types/profiles";

export type Tool = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: Component;
  roles: Role[];
};
