# Detroit Go Club Homepage

A modern website for the Detroit Go Club built with Next.js and Sanity CMS.

## Features

- **Landing Page**: Welcome message and club description
- **Rules Page**: Go rules and club guidelines
- **Calendar**: Historic and future meetup listings
- **Instagram Integration**: Direct links to @detroit_go_club
- **Sanity CMS**: Easy content management for club organizers

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **CMS**: Sanity CMS
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel deployment

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Sanity CMS

1. Create a new Sanity project at [sanity.io](https://sanity.io) or run:

   ```bash
   npx sanity@latest init --create-project "Detroit Go Club" --dataset production
   ```

2. **Configure Sanity for both frontend and Studio:**

   a. Create your environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   b. Fill in your Sanity credentials in `.env.local`:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token
   ```

   c. **Important:** Copy and configure the Sanity config:

   ```bash
   cp sanity/env.example.ts sanity/env.ts
   ```

   d. Edit `sanity/env.ts` and replace `'your-project-id-here'` with your actual project ID

### 3. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

### 4. Set up Sanity Studio

To manage content, you can run Sanity Studio alongside your Next.js app:

```bash
# Run both the website and Sanity Studio
npm run dev:all

# Or run them separately:
# Terminal 1: Website (localhost:3000)
npm run dev

# Terminal 2: Sanity Studio (localhost:3333)
npm run studio
```

**First time setup:** You'll need to authenticate with Sanity when you first run `npm run studio`. Follow the prompts to log in and connect to your project.

**Production Studio:** Once deployed, your Sanity Studio will be available at `https://your-app.fly.dev/studio` for content management.

## Content Management

### Pages

Create and edit pages like the rules page through Sanity Studio. The site will automatically fetch and display your content.

### Meetups

Add meetups with:

- Title and description
- Date and time
- Location
- Registration links
- Participant limits

### Site Settings

Configure:

- Welcome message
- Club description
- Contact information
- Instagram handle
- Logo

## Deployment

### Fly.io (Primary Method)

This project is configured to deploy to Fly.io using an ephemeral builder pattern that securely handles build-time secrets.

1. **Install the Fly CLI**:

   ```bash
   # macOS
   brew install flyctl

   # Linux/WSL
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up and authenticate**:

   ```bash
   fly auth signup
   # or
   fly auth login
   ```

3. **Launch your app** (first time):

   ```bash
   fly launch
   ```

   This will create your app and generate the `fly.toml` configuration file.

4. **Set your secrets**:

   ```bash
   fly secrets set NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   fly secrets set NEXT_PUBLIC_SANITY_DATASET=production
   fly secrets set SANITY_API_TOKEN=your_token
   ```

5. **Deploy using ephemeral builder**:

   ```bash
   fly console --dockerfile Dockerfile.builder -C "/srv/deploy.sh" --env=FLY_API_TOKEN=$(fly auth token)
   ```

   This deployment method uses Fly.io's [build secrets with ephemeral machines](https://fly.io/docs/apps/build-secrets/#automate-the-inclusion-of-build-secrets-using-an-ephemeral-machine) to securely inject environment variables during the build process.

6. **Open your app**:
   ```bash
   fly open
   ```

Your website will be available at the main URL, and the Sanity Studio will be accessible at `/studio` for content management.

### Alternative: Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

## Domain Setup

### For Fly.io

1. Add your custom domain:

   ```bash
   fly certs create detroitgo.club
   fly certs create www.detroitgo.club
   ```

2. Update your DNS records to point to Fly.io:
   - Add an `A` record for `detroitgo.club` pointing to Fly.io's IP addresses
   - Add a `CNAME` record for `www.detroitgo.club` pointing to your Fly.io app URL

3. Verify certificates:
   ```bash
   fly certs list
   ```

### For Other Platforms

Point your `detroitgo.club` domain to your hosting provider according to their DNS instructions.

## Contributing

This is a club website. Members can contribute by:

- Adding content through Sanity CMS
- Reporting issues
- Suggesting improvements

## Support

For technical issues or questions, contact the club organizers or create an issue in the repository.
