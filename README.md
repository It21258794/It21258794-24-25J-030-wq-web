# Water Board Project

This pilot project is a collaborative effort between the Water Board Sri Lanka and JRDC to develop and deploy a comprehensive water quality management system for the Meewathura Water Treatment Plant. The system integrates machine learning and deep learning models for predicting key water quality parameters and chemical consumption, and also forecasts step-wise treated water parameters. It supports real-time monitoring and visualization of sensor data through integration with the existing SCADA system. The goal is to improve water treatment efficiency and ensure proactive quality management of water sourced from the Mahaweli River.

## Architecture diagram
<img width="9428" alt="Water Quality Prediction - Conceptual Diagram (5)" src="https://github.com/user-attachments/assets/513e431d-df66-4edd-9ddb-8a797846ca71" />


### Key Functionalities

1. **Comprehensive Dashboard**

   - Visualizes sensor data from SCADA systems.
   - Enables real-time monitoring and management.

2. **Predictive Systems**

   - Uses machine learning models to forecast:
     - Water quality trends.
     - Chemical consumption rates.
     - all the predictions shows ina dedicate dashboard

3. **Early Notifications**

   - Proactive alerts for water quality deviations to ensure timely actions.
   - SMS and Gmail services
   - Dynamic email templates

4. **Flow Customization**
   - Tailored workflows adaptable to various institutions for managing water quality steps effectively.
   - This also includes step wise treated water quality parameter prediction in treatement process

## Getting Started

### Prerequisites

- **Node.js** (version >= 16.x)
- **npm** (version >= 8.x)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>

   ```

1. Install dependencies::

   ```bash
   npm install

   ```

1. Run the development server::
   ```bash
   npm run dev
   ```

Design Link
Explore the User Interface design on Figma:
Water Board Project UI

## Design Link

Explore the User Interface design on Figma:  
[Water Board Project UI](https://www.figma.com/design/1kMe9fuMOuRwmwVANtmvWv/Water-Board-Project?node-id=0-1&node-type=canvas&t=DWRKdrSyulOIF21X-0)

---

## Tech Stack

- **Frontend**: React with TypeScript
- **Version Control**: Git (with Conventional Commits)

### Conventional Commits

To maintain consistency and readability in the version history, follow the **Conventional Commits** standard. Examples of valid commit messages:

- `feat: add dashboard visualization`
- `fix: resolve bug in notification service`
- `docs: update README with Figma link`

For more details, refer to the [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/).

---

## Team Members

- **Shiraz M.S** - `IT21277054`
- **Karunasena H.G.M.K.K.L** - `IT21258794`
- **Hansani K.J.M** - `IT21222672`
- **Kumarasinghe O.A.** - `IT21174308`

## Pull Requests

> [!TIP]
> https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/2
>
> chore(system): initial setup of the FE with the layout and folder structure - 1 December 2024 at 05:09:23 GMT+5:30
>
> - Created Routing
> - Commits are now double checked to ensure conventional commits
> - Created seperate Modules for each function
> - Created the common layout

> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/3
> 
> Feature/impliment dashboards fe
> 
>- Implimented dashboard that showcases data in seperated diagrams.
>- Implimented sensor dashboard in order to shoawcsae sensors with the relevent details

> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/4
> 
> feat(waterqualityprediction): implemented water quality prediction
> 
>- Frontend implementation for the water quality prediction 
>- only for turbidity prediction with initial graphs

> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/5
> 
> Sensor Dashboard implimentation
> 
>- feat(sensor): created compare user interfaces
>- fix(dashboard): added new logo
>- fix(waterquality): water quality predictions enhancements

> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/6
> 
> user management 
> 
>- feat(water-quality): water quality predictions are added to dashboard
>- feat(user-management): login, logout, reset password, change password implemented admin dashboard implemented to manage users
>- fix(all module) -unused imports removed

> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/7
>
> chemical-consumption
> 
>- feat(chemical-consumption): implement chemical consumption prediction dashboard with graphs and data table
>- feat(Chemical Consumption): enhance layout and styling, adjust chart heights, and add dividers for better visual separation
>- feat(Chemical Consumption): add margin to typography for improved spacing

> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/8
> 
> dashboard
> 
>- feat(dashboard): customizations option for dashboard 
>- UI enhancements to related areas
>- New introductions such as UI customizations introduced to the dashboard.


> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/9
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/10
>
> user-management
> 
>- feat(user-management): settings page added with profile, security options
>- fix(water-quality-prediction):new graph added to show past predictions
>- ui enhanced in user management and water quality prediction parts


> [!TIP]
>https://github.com/It21258794/It21258794-24-25J-030-wq-web/pull/16
>
> Flow customization
> 
>- feat(flow-customization):Flow customization frontend completed



