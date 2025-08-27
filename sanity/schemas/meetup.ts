import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'meetup',
  title: 'Meetup',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'isCompleted',
      title: 'Is Completed',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      location: 'location',
    },
    prepare(selection) {
      const {title, date, location} = selection
      return {
        title,
        subtitle: `${new Date(date).toLocaleDateString()} - ${location}`,
      }
    },
  },
  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [
        {field: 'date', direction: 'desc'}
      ]
    },
    {
      title: 'Date, Old',
      name: 'dateAsc',
      by: [
        {field: 'date', direction: 'asc'}
      ]
    }
  ]
})