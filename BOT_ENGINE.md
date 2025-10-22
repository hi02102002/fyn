# Bot Engine Documentation

## Overview

The bot engine is a conversational bot builder inspired by Typebot. It allows users to create interactive chatbots with a visual flow builder and test them in a live preview environment.

## Features

### Block Types

1. **Text Block**
   - Display messages to users
   - Use for greetings, information, or prompts
   - Configuration: `text` (message content)

2. **Input Block**
   - Collect text responses from users
   - Store responses in variables for later use
   - Configuration: 
     - `placeholder` (input placeholder text)
     - `variable` (variable name to store the response)

3. **Choice Block**
   - Present multiple options to users
   - Users can select from predefined options
   - Configuration: `options` (array of choice options)

4. **Conditional Block**
   - Create branching logic based on user responses
   - Evaluate conditions on stored variables
   - Configuration:
     - `condition.variable` (variable to check)
     - `condition.operator` (equals, contains, greaterThan, lessThan)
     - `condition.value` (value to compare against)

### Pages

#### Bot List (`/bots`)
- View all your created bots
- See bot names, descriptions, and creation dates
- Quick access to create new bots

#### Bot Creation (`/bots/new`)
- Simple form to create a new bot
- Required: Bot name
- Optional: Bot description

#### Bot Builder (`/bots/:botId`)
- Visual bot builder interface
- Add blocks from the block palette
- Configure block settings in the side panel
- Connect blocks to create flows
- Save bot changes

#### Bot Preview (`/bots/:botId/preview`)
- Test your bot in a chat interface
- See how users will interact with your bot
- Reset and restart the bot at any time

## Architecture

### Database Schema

**Bot Table**
- `id` - Unique bot identifier
- `name` - Bot name
- `description` - Optional bot description
- `userId` - Owner's user ID
- `createdAt`, `updatedAt` - Timestamps

**BotBlock Table**
- `id` - Unique block identifier
- `botId` - Parent bot ID
- `type` - Block type (text, input, choice, conditional)
- `config` - JSON configuration for the block
- `position` - Canvas position (x, y)
- `connections` - Array of connected block IDs
- `createdAt`, `updatedAt` - Timestamps

**BotResponse Table**
- `id` - Unique response identifier
- `botId` - Bot ID
- `sessionId` - User session ID
- `responses` - JSON object of collected responses
- `completedAt` - Completion timestamp
- `createdAt`, `updatedAt` - Timestamps

### API Endpoints

All bot endpoints are accessible under the `bot` namespace:

- `bot.createBot` - Create a new bot
- `bot.getBot` - Get bot details with blocks
- `bot.listBots` - List all user's bots
- `bot.updateBot` - Update bot (including blocks)
- `bot.deleteBot` - Delete a bot
- `bot.executeBot` - Execute bot flow (public endpoint)

### Bot Execution Engine

The execution engine processes blocks sequentially:

1. **Start**: Bot execution begins at the first block
2. **Process Block**: Current block is processed based on its type
3. **Collect Response**: User input is stored if needed
4. **Evaluate**: For conditional blocks, conditions are evaluated
5. **Navigate**: Move to the next block based on connections
6. **Complete**: Bot completes when no next block exists

**Conditional Logic:**
- True path: First connection in the connections array
- False path: Second connection in the connections array

**Session Management:**
- Each user interaction creates a unique session
- Responses are stored per session
- Sessions persist across page refreshes

## Usage Example

### Creating a Simple Survey Bot

1. **Create Bot**
   - Navigate to `/bots/new`
   - Name: "Customer Feedback Survey"
   - Description: "Collect customer feedback"

2. **Add Blocks**
   - Block 1 (Text): "Welcome! We'd love to hear your feedback."
   - Block 2 (Input): "What is your name?" (variable: `name`)
   - Block 3 (Choice): "How satisfied are you?" (options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"])
   - Block 4 (Input): "Any additional comments?" (variable: `comments`)
   - Block 5 (Text): "Thank you for your feedback!"

3. **Connect Blocks**
   - Connect blocks in sequence: 1 → 2 → 3 → 4 → 5
   - Click "Connect" button on each block to link to the next

4. **Test Bot**
   - Navigate to Preview
   - Click "Start Bot"
   - Complete the survey
   - Review responses

## Future Enhancements

Potential features for future development:

- **Additional Block Types**
  - Email blocks
  - File upload blocks
  - API integration blocks
  - Delay/wait blocks

- **Advanced Features**
  - Visual flow diagram with drag-and-drop
  - Block duplication
  - Template library
  - Analytics dashboard
  - Export/import flows

- **Collaboration**
  - Share bots with team members
  - Public bot links
  - Embed bots on websites

- **Validation**
  - Input validation rules
  - Required fields
  - Format checking

## Technical Details

### Technology Stack

- **Frontend**: React, TanStack Router, TailwindCSS, shadcn/ui
- **Backend**: Hono, ORPC
- **Database**: PostgreSQL with Drizzle ORM
- **Type Safety**: TypeScript throughout

### Development

To work on the bot engine:

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Run type checking
pnpm check-types

# Run linter
pnpm lint

# Build for production
pnpm build
```

## License

Part of the fyn project.
