# AiGymApp

A comprehensive fitness application built with React Native and Expo for creating, managing, and tracking workout routines.

## 🏋️‍♂️ Project Overview

AiGymApp helps users achieve their fitness goals through personalized workout planning and tracking. The app offers:

- **Smart Routine Generation**: AI-powered quick routines based on user goals and experience
- **Custom Workout Builder**: Flexible tools to create personalized workout plans
- **Progress Tracking**: Detailed logging of sets, reps, weights, and workout completion
- **Structured Plans**: Both quick predefined routines and customizable programs
- **Exercise Library**: Comprehensive database of exercises with muscle targeting

## 💻 Technology Stack

| Category              | Technology                                 | Purpose                                         |
| --------------------- | ------------------------------------------ | ----------------------------------------------- |
| **Framework**         | React Native with Expo                     | Cross-platform mobile development               |
| **Language**          | TypeScript                                 | Static typing for improved developer experience |
| **State Management**  | Zustand                                    | Application state handling                      |
| **Routing**           | Expo Router (File-based)                   | Navigation and deep linking                     |
| **Styling**           | React Native StyleSheet + ThemeProvider    | Consistent, themeable UI                        |
| **API Communication** | Axios                                      | HTTP client for backend services                |
| **Icons**             | Expo Vector Icons (MaterialCommunityIcons) | Visual elements and feedback                    |
| **Build Tool**        | Expo CLI                                   | Development, building, and deployment           |
| **Linting**           | ESLint                                     | Code quality and consistency                    |

## 📂 Project Structure

```
src/
├── app/                    # Expo router route definitions
│   ├── (app)/              # Authenticated application sections
│   │   └── (tabs)/         # Bottom tab navigation
│   │       ├── routines/   # Workout routines listing
│   │       ├── progress/   # Fitness progress tracking
│   │       └── profile/    # User profile management
│   └── (onboarding)/       # User onboarding flows
│       └── (build-routine)/ # Workout creation workflow
│           ├── goals.tsx       # Fitness goal selection
│           ├── equipment.tsx   # Equipment preference setup
│           ├── experience.tsx  # Experience level selection
│           ├── muscleSelect.tsx # Muscle group targeting
│           ├── splitSelect.tsx  # Workout split configuration
│           ├── generating.tsx   # AI routine generation
│           ├── customModeSelect.tsx # Plan type selection
│           ├── confirmCustom.tsx # Custom plan confirmation
│           ├── daysSelect.tsx   # Weekly plan day selection
│           ├── muscleGroup.tsx  # Muscle-specific exercise selection
│           ├── exerciseSelect.tsx # Individual exercise selection
│           ├── confirm.tsx      # Final routine confirmation
│           └── weekPlanBuilder.tsx # Weekly plan builder
├── features/               # Feature-specific components and logic
│   ├── build-routine/      # Routine creation and management features
│   │   ├── components/     # Reusable UI components for routine building
│   │   │   ├── RoutineCard.tsx      # Routine display cards
│   │   │   ├── MuscleSelectionCard.tsx # Muscle group selection UI
│   │   │   ├── ImageSection.tsx     # Exercise image display
│   │   │   ├── CustomExerciseHeader.tsx # Exercise header with controls
│   │   │   ├── SeriesModal.tsx      # Exercise series/set management
│   │   │   ├── ExerciseCard.tsx     # Individual exercise display
│   │   │   ├── WorkoutSummaryModal.tsx # Workout completion summary
│   │   │   ├── ReplaceExerciseModal.tsx # Exercise substitution UI
│   │   │   ├── PendingAdjustmentsModal.xaml # Workout adjustments
│   │   │   ├── Skipbutton.tsx       # Set skipping controls
│   │   │   ├── Badge.tsx            # Status indicators
│   │   │   ├── StatBar.tsx          # Statistics display
│   │   │   ├── PrimaryButton.tsx    # Reusable button component
│   │   │   ├── BrandIcon.tsx        # Application branding
│   │   │   ├── GlobalLoader.tsx     # Global loading indicator
│   │   │   ├── OnboardingLayout.tsx # Consistent onboarding layout
│   │   │   ├── slider/              # Image slider components
│   │   │   │   ├── Phoneframe.tsx   # Device frame for images
│   │   │   │   └── ImageSlider.tsx  # Swipeable image container
│   │   │   ├── ParticleBackground.tsx # Animated background effects
│   │   │   ├── ImageExercise.tsx    # Exercise visualization
│   │   │   ├── ImageExieciseCard.tsx # Exercise card with image
│   │   │   ├── RoutineHeader.tsx    # Workout session header
│   │   │   └── AppHeader.tsx        # Application header with navigation
│   │   ├── screens/               # Screen-level components
│   │   │   ├── WorkoutSessionScreen.tsx # Main workout tracking interface
│   │   │   ├── RoutineScreen.tsx    # Routines library and creation
│   │   │   ├── Weekplanbuilderscreen.tsx # Weekly plan builder
│   │   │   ├── OnboardingScreen.tsx # Initial onboarding flow
│   │   │   ├── GoalsScreen.tsx      # Goal selection screen
│   │   │   ├── GeneratingRoutineScreen.tsx # AI generation progress
│   │   │   ├── ExperienceScreen.tsx # Experience level selection
│   │   │   ├── EquipmentScreen.tsx  # Equipment preference setup
│   │   │   ├── ConfirmRoutineScreen.tsx # Pre-workout confirmation
│   │   │   ├── MuscleSelectScreen.tsx # Muscle group selection
│   │   │   ├── MuscleGroupScreen.tsx # Exercise selection by muscle
│   │   │   ├── DaysSelectScreen.tsx # Weekly schedule setup
│   │   │   ├── CustomModeSelectScreen.tsx # Plan type selection
│   │   │   ├── ConfirmCustomScreen.tsx # Custom plan confirmation
│   │   │   └── ExerciseSelectScreen.tsx # Individual exercise picker
│   │   └── utils/                 # Feature-specific utilities
│   │       └── estimateDuration.tsx # Workout duration calculation
│   └── components/              # Shared feature components
│       ├── WorkoutSummaryModal.tsx
│       ├── Skipbutton.tsx
│       ├── SeriesModal.tsx
│       ├── ReplaceExerciseModal.tsx
│       ├── PendingAdjustmentsModal.tsx
│       ├── ExerciseCard.tsx
│       └── Completedexercisemodal.tsx
├── shared/                    # Truly shared components across features
│   └── components/            # Application-wide reusable UI elements
│       ├── StatBar.tsx
│       ├── PrimaryButton.tsx
│       ├── OnboardingLayout.tsx
│       ├── GlobalLoader.tsx
│       ├── BrandIcon.tsx
│       └── Badge.tsx
├── store/                     # State management (custom stores)
│   ├── routine/               # Routine-related state and actions
│   │   └── useRoutineStore.tsx # Core routine state management
│   ├── build-rotine/          # Routine building workflow state
│   │   ├── mode/              # Mode-specific stores
│   │   │   └── custom/        # Custom routine building
│   │   │       └── exercises.store.ts # Exercise selection state
│   │   └── buildRoutineStore.ts # Main routine building store
│   ├── notification/          # Notification system state
│   │   └── usenotificationstore
│   └── loading/               # Global loading state management
│       └── loadingStore.tsx
├── services/                  # API services and service-specific types
│   └── type/                  # Service-specific TypeScript interfaces
│       └── routineService.types.ts # Routine API response types
├── types/                     # Centralized TypeScript type definitions
│   ├── auth/                  # Authentication-related types
│   │   ├── auth.ts            # Form and payload types
│   │   ├── user.ts            # User profile type
│   │   └── index.ts           # Exported auth types
│   └── routine/               # Routine domain types
│       ├── routine.type.ts    # Core routine/exercise types
│       ├── index.ts           # Exported routine types (centralized)
│       └── (session.type.ts removed - consolidated into index.ts)
├── theme/                     # Application theming
│   └── ThemeProvider.tsx      # Theme context and provider
├── assets/                    # Static assets
│   └── [images, icons, etc.]
└── [configuration files]      # app.json, babel.config.js, etc.
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio (for Android emulator)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd AiGymApp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env with your configuration
   # Example:
   # EXPO_PUBLIC_API_URL=https://your-api-domain.com
   # EXPO_PUBLIC_API_VERSION=v1
   ```

### Running the Application

```bash
# Start the development server
npx expo start

# In the Expo Dev Menu that appears:
# - Press 'a' to open on Android emulator
# - Press 'i' to open on iOS simulator
# - Press 'w' to open in web browser
# - Press 'd' to open developer menu
# - Press 'r' to refresh the application
# - Press 'shift + d' to toggle development mode
```

### Building for Production

```bash
# Create a development build
npx expo prebuild
npx expo run:[android|ios]

# Or use Expo Application Services (EAS)
# eas build --platform android
# eas build --platform ios
```

## 🧠 Development Guidelines

### Code Organization Principles

1. **Feature-First Structure**: Organize code by feature domain rather than file type
2. **Component Hierarchy**:
   - **Atoms**: Small, reusable UI elements (Button, Icon, Text variants)
   - **Molecules**: Combinations of atoms forming distinct UI pieces (ExerciseCard, RoutineCard)
   - **Organisms**: Complex UI components combining molecules (WorkoutSessionScreen)
   - **Templates**: Page-level structures
   - **Pages**: Screen components tied to routes
3. **Separation of Concerns**: Keep UI, logic, and data layers distinct
4. **Single Responsibility**: Each file/module should have one clear purpose

### TypeScript Best Practices

1. **Type Centralization**: Keep shared interfaces in `src/types/`
2. **Interface Preference**: Use `interface` over `type` for object shapes when possible
3. **Avoid `any`**: Use specific types or `unknown` with type guards
4. **Utility Types**: Leverage `Partial`, `Required`, `Pick`, `Omit`, `Record` as needed
5. **Enum Usage**: Prefer `const enum` or union types over numeric enums
6. **Generic Components**: Make reusable components generic when appropriate

### State Management Patterns

1. **Store Structure**:

   ```typescript
   interface State {
     // State properties
   }

   interface Actions {
     // Action methods that return new state
   }

   const createStore = () => {
     const state = reactive<State>(/* initial state */);
     return {
       state,
       ...Actions(/* actions that modify state */),
     };
   };
   ```

2. **Immutability**: Treat state as immutable; return new objects/arrays
3. **Selectors**: Create derived state selectors for complex computations
4. **Actions**: Keep actions pure and testable; avoid side effects in stores
5. **Store Composition**: Combine smaller stores for complex features

### Styling and Theming Guidelines

1. **Theme Usage**:

   ```typescript
   // Correct
   import { useAppTheme } from "@/theme/ThemeProvider";
   const { theme } = useAppTheme();

   // Use theme properties
   <Text style={{ color: theme.textPrimary }}>
   ```

2. **StyleSheet Creation**:
   ```typescript
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       padding: 16,
       backgroundColor: theme.background,
     },
   });
   ```
3. **Spacing Scale**: Use 4px or 8px multiples for consistent spacing
4. **Platform Adaptation**: Use `Platform.select()` when needed:
   ```typescript
   Platform.select({
     ios: {
       /* iOS styles */
     },
     android: {
       /* Android styles */
     },
     default: {
       /* fallback styles */
     },
   });
   ```
5. **Dark Mode Support**: Ensure all colors come from theme, not hardcoded values

### Component Development Standards

1. **Props Interface**: Define explicit props interfaces:

   ```typescript
   interface ComponentProps {
     title: string;
     onPress: () => void;
     disabled?: boolean;
   }

   export const MyComponent = ({
     title,
     onPress,
     disabled,
   }: ComponentProps) => {
     // Implementation
   };
   ```

2. **Default Props**: Use destructuring with defaults:
   ```typescript
   export const MyComponent = ({
     title = "Default",
     onPress = () => {},
     disabled = false,
   }: ComponentProps) => {
     // Implementation
   };
   ```
3. **Children Props**: Explicitly type children when needed:
   ```typescript
   interface WrapperProps {
     children: React.ReactNode;
     className?: string;
   }
   ```
4. **Event Handlers**: Type event handlers properly:
   ```typescript
   const handlePress = (e: GestureResponderEvent) => {
     // Implementation
   };
   ```

### Navigation and Routing

1. **File-Based Routing**: Use Expo Router's convention:
   - `app/(tabs)/routines/index.tsx` → `/(tabs)/routines/`
   - Use `_layout.tsx` for shared route layouts
   - Route groups with parentheses: `(auth)`, `(app)`
2. **Linking**: Use Expo Router's `Link` component or `router.push()`:

   ```typescript
   import { Link } from "expo-router";
   // or
   import { router } from "expo-router";

   // JSX
   <Link href="/(app)/routine">Go to Routine</Link>

   // Imperative
   router.push("/(app)/routine");
   ```

3. **Route Parameters**: Access via `useParams()` or route props
4. **Loading States**: Handle loading in route components, not layout

### Performance Optimization

1. **Memoization**:

   ```typescript
   // Memoize expensive calculations
   const memoizedValue = useMemo(() => {
     return computeExpensiveValue(a, b);
   }, [a, b]);

   // Memoize callback functions
   const memoizedCallback = useCallback(() => {
     doSomething(a, b);
   }, [a, b]);

   // Memoize components
   const MemoizedComponent = memoize(Component);
   ```

2. **Image Optimization**:
   - Use appropriate image dimensions
   - Compress images before adding to assets
   - Consider using `Image` component's resize modes
   - Use caching strategies for remote images
3. **List Virtualization**: Use `FlatList` with `getItemLayout` for fixed-height items
4. **Bundle Analysis**: Regularly run:
   ```bash
   npx expo-doctor
   npx expo start --dev-client
   ```
5. **Lazy Loading**: Consider code splitting for large feature modules

### Testing Strategies

1. **Unit Testing**:
   - Test utility functions and pure business logic
   - Mock external dependencies (API calls, etc.)
   - Use Jest with TypeScript support
2. **Component Testing**:
   - Test rendering with various props
   - Test user interactions and state changes
   - Consider React Native Testing Library
3. **End-to-End Testing**:
   - Consider Detox for automated E2E tests
   - Test critical user flows (login, workout creation, tracking)
4. **Test Naming Convention**:
   ```typescript
   // describe("functionName", () => {
   //   it("should do X when Y", () => {
   //     // test implementation
   //   });
   // });
   ```

### Git Workflow

1. **Branch Naming**:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `refactor/` for code refactoring
   - `docs/` for documentation changes
   - `chore/` for maintenance tasks
2. **Commit Messages**:

   ```
   type(scope): description

   feat(auth): add login with social media
   fix(workout): correct duration calculation
   refactor(types): consolidate routine types
   docs(readme): update development guidelines
   chore(deps): update dependencies
   ```

3. **Pull Request Process**:
   - Keep PRs focused and small
   - Include description of changes and motivation
   - Link to related issues
   - Require at least one approval
   - Ensure CI passes before merging

## 🛠️ Available Scripts

| Command                        | Description                        |
| ------------------------------ | ---------------------------------- | ------------------------------------ |
| `npm install`                  | Install project dependencies       |
| `npx expo start`               | Start development server           |
| `npx expo start --android`     | Start and open on Android emulator |
| `npx expo start --ios`         | Start and open on iOS simulator    |
| `npx expo start --web`         | Start and open in web browser      |
| `npx expo start -c`            | Start with cleared cache           |
| `npx tsc --noEmit`             | Type-check TypeScript files        |
| `npm run lint`                 | Run ESLint (if configured)         |
| `npm run reset-project`        | Reset to starter project state     |
| `npx expo prebuild`            | Generate native project files      |
| `npx expo run:[android         | ios]`                              | Run on native simulator/emulator     |
| `eas build --platform [android | ios]`                              | Build with Expo Application Services |

## 🤝 Contributing

### How to Contribute

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/AiGymApp.git
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes following the development guidelines
5. Commit your changes with clear, descriptive messages
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request against the main repository

### Code Review Process

- All PRs require at least one approval from maintainers
- Ensure code follows established style guidelines
- Include tests for new functionality when applicable
- Update documentation if needed
- Keep changes focused and atomic

### Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots or screen recordings if applicable
- Environment details (device, OS version, Expo version)

## 📄 Environment Variables

Create a `.env` file in the project root with the following format:

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api-domain.com
EXPO_PUBLIC_API_VERSION=v1
EXPO_PUBLIC_API_TIMEOUT=10000

# Feature Flags (optional)
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_DEBUG_TOOLS=true

# Note: Only variables prefixed with EXPO_PUBLIC_ are exposed to the client
# Keep sensitive keys in backend services, not in client-side code
```

## 📱 Platform Support

| Platform    | Minimum Version      | Notes                                             |
| ----------- | -------------------- | ------------------------------------------------- |
| **Android** | API 21 (Android 5.0) | Tested on emulators and physical devices          |
| **iOS**     | 13.0                 | Tested on simulators and physical devices         |
| **Web**     | Modern browsers      | Responsive design for desktop and mobile browsers |

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For providing an exceptional development experience
- **React Native Community**: For countless libraries and components
- **Open Source Contributors**: To all who have contributed to this project
- **Design Inspiration**: From leading fitness applications and platforms

---

_Last updated: March 31, 2026_
_For questions or support, please open an issue in the repository._
