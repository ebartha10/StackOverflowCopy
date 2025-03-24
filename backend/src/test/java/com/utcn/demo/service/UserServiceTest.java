package com.utcn.demo.service;

import com.utcn.demo.dto.UserDTO;
import com.utcn.demo.entity.User;
import com.utcn.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    public void testGetUserById_existingUser_returnsUserDTO() {
        // Arrange
        User user = new User();
        user.setId("123");
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setScore(10.5);
        user.setAdmin(true);

        Mockito.when(userRepository.findById("123")).thenReturn(Optional.of(user));

        // Act
        UserDTO result = userService.getUserById("123");

        // Assert
        assertNotNull(result);
        assertEquals("123", result.getId());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test User", result.getName());
        assertEquals(10.5, result.getScore());
        assertTrue(result.isAdmin());
    }

    @Test
    public void testGetUserById_nonExistingUser_returnsNull() {
        // Arrange
        Mockito.when(userRepository.findById("999")).thenReturn(Optional.empty());

        // Act
        UserDTO result = userService.getUserById("999");

        // Assert
        assertNull(result);
    }

    @Test
    public void testGetUserByEmail_existingUser_returnsUserDTO() {
        // Arrange
        User user = new User();
        user.setId("abc");
        user.setEmail("bogdan@example.com");
        user.setName("Bogdan");
        user.setScore(42.0);
        user.setAdmin(false);

        Mockito.when(userRepository.findFirstByEmail("bogdan@example.com")).thenReturn(Optional.of(user));

        // Act
        UserDTO result = userService.getUserByEmail("bogdan@example.com");

        // Assert
        assertNotNull(result);
        assertEquals("abc", result.getId());
        assertEquals("bogdan@example.com", result.getEmail());
        assertEquals("Bogdan", result.getName());
        assertEquals(42.0, result.getScore());
        assertFalse(result.isAdmin());
    }

    @Test
    public void testGetUserByEmail_nonExistingUser_returnsNull() {
        // Arrange
        Mockito.when(userRepository.findFirstByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // Act
        UserDTO result = userService.getUserByEmail("notfound@example.com");

        // Assert
        assertNull(result);
    }

    @Test
    public void testUpdateUser_existingUser_updatesAndReturnsDTO() {
        // Arrange
        User existingUser = new User();
        existingUser.setId("321");
        existingUser.setEmail("update@example.com");
        existingUser.setName("Old Name");
        existingUser.setScore(1.0);
        existingUser.setAdmin(false);

        User updatedUser = new User();
        updatedUser.setId("321");
        updatedUser.setEmail("update@example.com");
        updatedUser.setName("New Name");
        updatedUser.setScore(10.0);
        updatedUser.setAdmin(true);

        UserDTO inputDTO = new UserDTO("321", "update@example.com", "New Name", 10.0, true);

        Mockito.when(userRepository.findById("321")).thenReturn(Optional.of(existingUser));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(updatedUser);

        // Act
        UserDTO result = userService.updateUser(inputDTO);

        // Assert
        assertNotNull(result);
        assertEquals("321", result.getId());
        assertEquals("update@example.com", result.getEmail());
        assertEquals("New Name", result.getName());
        assertEquals(10.0, result.getScore());
        assertTrue(result.isAdmin());
    }

    @Test
    public void testUpdateUser_nonExistingUser_returnsNull() {
        // Arrange
        UserDTO inputDTO = new UserDTO("999", "ghost@example.com", "Ghost", 0.0, false);

        Mockito.when(userRepository.findById("999")).thenReturn(Optional.empty());

        // Act
        UserDTO result = userService.updateUser(inputDTO);

        // Assert
        assertNull(result);
    }

    @Test
    public void testDeleteUser_successfulDeletion_returnsSuccessMessage() {
        // Arrange – nu avem nevoie de setup special aici
        Mockito.doNothing().when(userRepository).deleteById("123");

        // Act
        String result = userService.deleteUser("123");

        // Assert
        assertEquals("User successfully deleted!", result);
    }

    @Test
    public void testDeleteUser_exceptionThrown_returnsNull() {
        // Arrange – simulăm o excepție
        Mockito.doThrow(new RuntimeException()).when(userRepository).deleteById("999");

        // Act
        String result = userService.deleteUser("999");

        // Assert
        assertNull(result);
    }

}
