// src/dto/userDTO.js
class UsersDTO {
    constructor({ first_name, last_name, email, role }) {
        this.name = `${first_name} ${last_name}`;
        this.email = email;
        this.role = role;
    }
}

export default UsersDTO;