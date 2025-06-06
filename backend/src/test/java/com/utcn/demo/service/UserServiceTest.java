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
        User user = new User();
        user.setId("123");
        user.setEmail("test@example.com");
        user.setName("Test User");
        user.setScore(10.5);
        user.setAdmin(true);

        Mockito.when(userRepository.findById("123")).thenReturn(Optional.of(user));

        UserDTO result = userService.getUserById("123");

        assertNotNull(result);
        assertEquals("123", result.getId());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test User", result.getName());
        assertEquals(10.5, result.getScore());
        assertTrue(result.isAdmin());
    }

    @Test
    public void testGetUserById_nonExistingUser_returnsNull() {
        Mockito.when(userRepository.findById("999")).thenReturn(Optional.empty());

        UserDTO result = userService.getUserById("999");

        assertNull(result);
    }

    @Test
    public void testGetUserByEmail_existingUser_returnsUserDTO() {
        User user = new User();
        user.setId("abc");
        user.setEmail("bogdan@example.com");
        user.setName("Bogdan");
        user.setScore(42.0);
        user.setAdmin(false);

        Mockito.when(userRepository.findFirstByEmail("bogdan@example.com")).thenReturn(Optional.of(user));

        UserDTO result = userService.getUserByEmail("bogdan@example.com");

        assertNotNull(result);
        assertEquals("abc", result.getId());
        assertEquals("bogdan@example.com", result.getEmail());
        assertEquals("Bogdan", result.getName());
        assertEquals(42.0, result.getScore());
        assertFalse(result.isAdmin());
    }

    @Test
    public void testGetUserByEmail_nonExistingUser_returnsNull() {
        Mockito.when(userRepository.findFirstByEmail("notfound@example.com")).thenReturn(Optional.empty());

        UserDTO result = userService.getUserByEmail("notfound@example.com");

        assertNull(result);
    }

    @Test
    public void testUpdateUser_existingUser_updatesAndReturnsDTO() {
        User adminUser = new User();
        adminUser.setId("admin123");
        adminUser.setAdmin(true);

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

        UserDTO inputDTO = new UserDTO("321", "update@example.com", "New Name", 10.0, true, false);

        Mockito.when(userRepository.findById("admin123")).thenReturn(Optional.of(adminUser));
        Mockito.when(userRepository.findById("321")).thenReturn(Optional.of(existingUser));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(updatedUser);

        UserDTO result = userService.updateUser(inputDTO, "admin123");

        assertNotNull(result);
        assertEquals("321", result.getId());
        assertEquals("update@example.com", result.getEmail());
        assertEquals("New Name", result.getName());
        assertEquals(10.0, result.getScore());
        assertTrue(result.isAdmin());
    }

    @Test
    public void testUpdateUser_nonExistingUser_returnsNull() {
        User adminUser = new User();
        adminUser.setId("admin123");
        adminUser.setAdmin(true);

        UserDTO inputDTO = new UserDTO("999", "ghost@example.com", "Ghost", 0.0, false, false);

        Mockito.when(userRepository.findById("admin123")).thenReturn(Optional.of(adminUser));
        Mockito.when(userRepository.findById("999")).thenReturn(Optional.empty());

        UserDTO result = userService.updateUser(inputDTO, "admin123");

        assertNull(result);
    }

    @Test
    public void testDeleteUser_successfulDeletion_returnsSuccessMessage() {
        User adminUser = new User();
        adminUser.setId("admin123");
        adminUser.setAdmin(true);

        Mockito.when(userRepository.findById("admin123")).thenReturn(Optional.of(adminUser));
        Mockito.doNothing().when(userRepository).deleteById("123");

        String result = userService.deleteUser("admin123", "admin123");

        assertEquals("User successfully deleted!", result);
    }

    @Test
    public void testDeleteUser_exceptionThrown_returnsNull() {
        User adminUser = new User();
        adminUser.setId("admin123");
        adminUser.setAdmin(true);

        Mockito.when(userRepository.findById("admin123")).thenReturn(Optional.of(adminUser));
        Mockito.doThrow(new RuntimeException()).when(userRepository).deleteById("999");

        String result = userService.deleteUser("999", "admin123");

        assertEquals(null, result);
    }

    @Test
    public void testBanUser_successfulBan_returnsSuccessMessage() {
        User adminUser = new User();
        adminUser.setId("admin123");
        adminUser.setAdmin(true);

        User userToBan = new User();
        userToBan.setId("123");
        userToBan.setEmail("user@example.com");
        userToBan.setName("Test User");
        userToBan.setBanned(false);

        Mockito.when(userRepository.findById("admin123")).thenReturn(Optional.of(adminUser));
        Mockito.when(userRepository.findById("123")).thenReturn(Optional.of(userToBan));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(userToBan);

        String result = userService.banUser("123", "admin123");

        assertEquals("User successfully banned!", result);
        assertTrue(userToBan.isBanned());
    }

    @Test
    public void testUnbanUser_successfulUnban_returnsSuccessMessage() {
        User adminUser = new User();
        adminUser.setId("admin123");
        adminUser.setAdmin(true);

        User userToUnban = new User();
        userToUnban.setId("123");
        userToUnban.setEmail("user@example.com");
        userToUnban.setName("Test User");
        userToUnban.setBanned(true);

        Mockito.when(userRepository.findById("admin123")).thenReturn(Optional.of(adminUser));
        Mockito.when(userRepository.findById("123")).thenReturn(Optional.of(userToUnban));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(userToUnban);

        String result = userService.unbanUser("123", "admin123");

        assertEquals("User successfully unbanned!", result);
        assertFalse(userToUnban.isBanned());
    }
}
