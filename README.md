
# WeaDa - Weather Dashboard Application

WeaDa is a modern weather dashboard application that provides personalized weather forecasts with user authentication capabilities.

## Features

- User Authentication (Login/Register)
- Personalized Weather Dashboard
- Real-time Weather Updates
- Responsive Design (Mobile, Tablet, Desktop)
- Dark Theme Interface

## Tech Stack

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Responsive Design

- Backend:
  - PHP
  - MySQL
  - PDO for Database Connection
  - Session Management

- Database:
  - MySQL/MariaDB
  - Table Structure for Users

## Prerequisites

- XAMPP (or similar local server stack)
  - Apache Server
  - MySQL Server
  - PHP 7.4+
- Web Browser (Chrome, Firefox, Safari, Edge)
- Text Editor (VS Code, Sublime, etc.)

## Installation

1. Clone the repository:

```bash
  git clone https://github.com/LimaJuni/WeaDa-App.git
```

2. Set up the database:
- Start XAMPP
- Open phpMyAdmin
- Create new database 'weada_db'
- Import the SQL file from `database/weada_db.sql`

3. Configure the application:
- Place the project in your XAMPP htdocs folder
- Update database credentials in `assets/php/config.php` if needed


## Usage

1. Start XAMPP:
   - Start Apache and MySQL services

2. Access the application:
   - Local: `http://localhost/weada`
   - Online: `https://your-domain.com`

3. Authentication:
   - Register new account
   - Login with credentials
   - Access personalized dashboard

## Database Schema


```sql
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
fullname VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Password Hashing
- Prepared Statements
- Input Validation
- Session Management
- CSRF Protection
- SQL Injection Prevention

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Online Deployment

To deploy online:

1. Choose a web hosting service
2. Upload files to hosting
3. Create MySQL database
4. Update config.php with new credentials
5. Import database structure
6. Test all functionality

## Troubleshooting

Common issues and solutions:

1. Database Connection:
   - Verify MySQL is running
   - Check credentials in config.php
   - Confirm database exists

2. XAMPP Issues:
   - Check Apache and MySQL are running
   - Verify ports are not in use
   - Check error logs

3. Authentication Issues:
   - Clear browser cache
   - Check session configuration
   - Verify PHP version compatibility

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Lima Junior - tahjunior028@gmail.com
Project Link: https://github.com/LimaJuni/WeaDa-App

## Acknowledgments

- Weather API Provider
- Icon Libraries
- Framework Contributors

## Authors

- [@limajuni](https://github.com/LimaJuni)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Support

For support, follow me on [LinkedIn](www.linkedin.com/in/ewear-lima-junior-68aba92a4).