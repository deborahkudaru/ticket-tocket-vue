<script setup>
import { reactive, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification"; 
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();


const router = useRouter();
const route = useRoute();
const toast = useToast();

const msg = route.query.m || "";

const form = reactive({
  email: "",
  password: "",
});

const errors = reactive({});

const validate = () => {
  const err = {};
  if (!form.email) {
    err.email = "Email is required";
  } else if (!form.email.includes("@")) {
    err.email = "Enter a valid email address";
  }

  if (!form.password) {
    err.password = "Password is required";
  } else if (form.password.length < 6) {
    err.password = "Password must be at least 6 characters";
  }

  Object.assign(errors, err);
  return Object.keys(err).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    await auth.login({ email: form.email, password: form.password });
    toast.success("Login successful");
    router.replace("/dashboard");
  } catch (err) {
    toast.error(err.message || "Invalid credentials");
    errors.password = err.message || "Invalid credentials";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      <!-- Session Expired Message -->
      <div
        v-if="msg === 'session_expired'"
        class="text-red-700 px-4 py-3 rounded mb-6 text-center"
      >
        Your session has expired.
      </div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Login</h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
            :class="errors.email
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-slate-600 focus:border-transparent'"
            placeholder="Enter your email"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-2">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-colors"
            :class="errors.password
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-slate-600 focus:border-transparent'"
            placeholder="Enter your password"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-2">{{ errors.password }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Login
        </button>
      </form>

      <!-- Signup Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don’t have an account?
          <RouterLink
            to="/auth/signup"
            class="text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Sign up
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>


