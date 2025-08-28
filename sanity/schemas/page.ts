import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isHomepage',
      title: 'Is Homepage',
      type: 'boolean',
      description: 'Mark this page as the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'welcomeMessage',
      title: 'Welcome Message',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      hidden: ({ document }) => !document?.isHomepage,
      description: 'Homepage welcome message (only shown if this is the homepage)',
    }),
    defineField({
      name: 'clubDescription',
      title: 'Club Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      hidden: ({ document }) => !document?.isHomepage,
      description: 'About our club section (only shown if this is the homepage)',
    }),
    defineField({
      name: 'gettingStarted',
      title: 'Getting Started Section',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      hidden: ({ document }) => !document?.isHomepage,
      description: 'Getting started content for new members (only shown if this is the homepage)',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      isHomepage: 'isHomepage',
    },
    prepare(selection) {
      const { title, slug, isHomepage } = selection
      return {
        title: isHomepage ? `🏠 ${title}` : title,
        subtitle: slug?.current,
      }
    },
  },
})
