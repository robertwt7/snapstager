"use client";
import { BoltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { UserContext } from "../Dashboard/Layout/UserContext";
import { Button, TextInput, rem } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { FormValues, updateProfile } from "app/dashboard/profile/actions";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const schema = yup.object<Record<keyof FormValues, yup.AnySchema>>().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  newPassword: yup.lazy((value) =>
    !value
      ? yup.string()
      : yup
          .string()
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
          ),
  ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
  password: yup.string().required("Password is required"),
});

export const Profile: FunctionComponent = () => {
  const {
    userProfile: { credit, firstName, lastName },
    userSession,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      newPassword: "",
      confirmPassword: "",
      password: "",
    },
    validate: yupResolver(schema),
  });

  useEffect(() => {
    form.setInitialValues({
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      newPassword: "",
      confirmPassword: "",
      password: "",
    });
  }, [firstName, lastName, form]);
  return (
    <div>
      <form
        onSubmit={form.onSubmit(async (values) => {
          setLoading(true);
          if (userSession?.email) {
            try {
              await updateProfile(values, userSession?.email);
              notifications.show({
                title: "Successful",
                message: "Your Profile Has Successfully been Updated",
                icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
                color: "teal",
              });
            } catch (e) {
              console.log(
                "Something went wrong when updating user profile on client",
              );
              notifications.show({
                title: "Bummer",
                message: "Something went wrong, please try again",
                icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
                color: "red",
              });
            }
          }
          setLoading(false);
        })}
      >
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            User Information
          </h3>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Full name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-row space-x-4">
                  <TextInput
                    placeholder="First Name"
                    {...form.getInputProps("firstName")}
                  />
                  <TextInput
                    placeholder="Last Name"
                    {...form.getInputProps("lastName")}
                  />
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Current Password
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-row">
                  <TextInput
                    type="password"
                    placeholder="Current Password"
                    {...form.getInputProps("password")}
                  />
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                New Password
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-row space-x-4">
                  <TextInput
                    placeholder="New Password"
                    type="password"
                    {...form.getInputProps("newPassword")}
                  />
                  <TextInput
                    placeholder="Confirm Password"
                    type="password"
                    {...form.getInputProps("confirmPassword")}
                  />
                </div>{" "}
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {userSession?.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                User Credit
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-row">
                  <BoltIcon className="h-6 w-6 text-yellow-600" />
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    {`${credit} credits`}
                  </span>
                </div>
              </dd>
            </div>
          </dl>
          <div className="flex w-full">
            <Button
              className="ml-auto mr-0 mt-8"
              type="submit"
              loading={loading}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
