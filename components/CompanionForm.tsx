"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { subjects } from "@/constants"
import { Textarea } from "./ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, { message: 'Companion is required.' }),
  subject: z.string().min(2, { message: 'Subject is required.' }),
  topic: z.string().min(2, { message: 'Topic is required.' }),
  voice: z.string().min(2, { message: 'Companion is required.' }),
  style: z.string().min(2, { message: 'Companion is required.' }),
  duration: z.coerce.number().min(1, { message: 'Duration is required.' }),
})

const CompanionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      subject: '',
      topic: '',
      voice: '',
      style: '',
      duration: 30,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a Name for your companion"
                  {...field}
                  className="input" />
              </FormControl>
              {/*
              <FormDescription>
                This is your public display name.
              </FormDescription>
              */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}>

                  <SelectTrigger className="input capitalize">
                    <SelectValue placeholder="select the subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        value={subject}
                        key={subject}
                        className="capitalize"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What subject would you like to learn</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex. basics of doing integrals"
                  {...field}
                  className="input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}>

                  <SelectTrigger className="input">
                    <SelectValue placeholder="select the voice" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value="Male">
                      Male
                    </SelectItem>

                    <SelectItem value="Female">
                      Female
                    </SelectItem>

                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}>

                  <SelectTrigger className="input">
                    <SelectValue placeholder="select the Tone of your teacher" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value="formal">
                     Formal 
                    </SelectItem>

                    <SelectItem value="casual">
                     Casual 
                    </SelectItem>

                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                type="number"
                  placeholder="30"
                  {...field}
                  className="input" />
              </FormControl>
              {/*
              <FormDescription>
                This is your public display name.
              </FormDescription>
              */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full cursor-pointer">Submit</Button>
      </form>
    </Form>
  )
}

export default CompanionForm
