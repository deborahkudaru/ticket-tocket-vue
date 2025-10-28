<script setup>
import { reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

const router = useRouter();
const toast = useToast();

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirm: "",
});

const errors = reactive({});
const passwordHints = reactive({
  length: false,
  upper: false,
  lower: false,
  number: false,
  special: false,
});

const validatePassword = () => {
  const val = form.password;
  passwordHints.length = val.length >= 6;
  passwordHints.upper = /[A-Z]/.test(val);
  passwordHints.lower = /[a-z]/.test(val);
  passwordHints.number = /[0-9]/.test(val);
  passwordHints.special = /[!@#$%^&*(),.?":{}|<>]/.test(val);
};

const validate = () => {
  const err = {};
  if (!form.name.trim()) err.name = "Name is required";
  if (!form.email.includes("@")) err.email = "Enter a valid email";

  const { length, upper, lower, number, special } = passwordHints;
  if (!length || !upper || !lower || !number || !special) {
    err.password = "Password must include upper, lower, number, and special char";
  }

  if (form.password !== form.confirm) err.confirm = "Passwords do not match";

  Object.assign(errors, err);
  return Object.keys(err).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    await auth.signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    toast.success("Signup successful");
    router.push("/dashboard");
  } catch (err) {
    toast.error(err.message || "Signup failed. Please try again.");
    console.error(err);
  }
};
</script>


<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            v-model="form.name"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors"
            placeholder="Enter your full name"
          />
          <p v-if="errors.name" class="text-red-600 text-sm mt-2">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors"
            placeholder="Enter your email"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-2">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="form.password"
            type="password"
            @input="validatePassword"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors"
            placeholder="Create a password"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-2">{{ errors.password }}</p>

          <ul class="text-xs text-gray-600 mt-2 space-y-1">
            <li :class="passwordHints.length ? 'text-green-600' : 'text-gray-400'">
              • At least 6 characters
            </li>
            <li :class="passwordHints.upper ? 'text-green-600' : 'text-gray-400'">
              • At least one uppercase letter
            </li>
            <li :class="passwordHints.lower ? 'text-green-600' : 'text-gray-400'">
              • At least one lowercase letter
            </li>
            <li :class="passwordHints.number ? 'text-green-600' : 'text-gray-400'">
              • At least one number
            </li>
            <li :class="passwordHints.special ? 'text-green-600' : 'text-gray-400'">
              • At least one special character
            </li>
          </ul>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            v-model="form.confirm"
            type="password"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-colors"
            placeholder="Confirm your password"
          />
          <p v-if="errors.confirm" class="text-red-600 text-sm mt-2">{{ errors.confirm }}</p>
        </div>

        <button
          type="submit"
          class="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Create Account
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Already have an account?
          <RouterLink
            to="/auth/login"
            class="text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

