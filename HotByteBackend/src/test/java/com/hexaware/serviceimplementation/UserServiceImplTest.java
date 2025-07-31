package com.hexaware.serviceimplementation;

import com.hexaware.dto.UserCreateDTO;
import com.hexaware.dto.UserDTO;
import com.hexaware.entity.User;
import com.hexaware.enums.UserRole;
import com.hexaware.enums.UserStatus;
import com.hexaware.exceptions.ResourceNotFoundException;
import com.hexaware.exceptions.UserAlreadyExistsException;
import com.hexaware.exceptions.UserNotFoundException;
import com.hexaware.mapper.UserMapper;
import com.hexaware.repository.CustomerRepository;
import com.hexaware.repository.OrderRepository;
import com.hexaware.repository.RestaurantRepository;
import com.hexaware.repository.UserRepository;
import com.hexaware.serviceImplementation.UserServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private CustomerRepository customerRepository;

    private User user;
    private UserDTO userDTO;
    private UserCreateDTO userCreateDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User(1, "john@example.com", "encodedPass", "John", "john@example.com", "9876543210", UserRole.CUSTOMER, UserStatus.ACTIVE, 0, LocalDate.now(), null);
        userDTO = new UserDTO(1, "john@example.com", "John", "john@example.com", "9876543210", UserRole.CUSTOMER, UserStatus.ACTIVE, null, LocalDate.now(), 0, null, null);
        userCreateDTO = new UserCreateDTO("john@example.com", "John", "john@example.com", "9876543210", "password123", UserRole.CUSTOMER, UserStatus.ACTIVE);
    }

    @Test
    void testCreateUser_Success() {
        when(userRepository.existsByEmail(userCreateDTO.getEmail())).thenReturn(false);
        when(userMapper.userCreateDtoToUser(userCreateDTO)).thenReturn(user);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPass");
        when(userRepository.save(any())).thenReturn(user);
        when(userMapper.userToUserDto(any())).thenReturn(userDTO);

        UserDTO createdUser = userService.createUser(userCreateDTO);

        assertNotNull(createdUser);
        assertEquals(userDTO.getEmail(), createdUser.getEmail());
        verify(userRepository).save(any());
    }

    @Test
    void testCreateUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail(userCreateDTO.getEmail())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(userCreateDTO));
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userMapper.userToUserDto(user)).thenReturn(userDTO);

        UserDTO result = userService.getUserById(1);

        assertNotNull(result);
        assertEquals(1, result.getUserId());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(1));
    }

    @Test
    void testGetAllUsers() {
        List<User> userList = List.of(user);
        when(userRepository.findAll()).thenReturn(userList);
        when(userMapper.userToUserDto(any())).thenReturn(userDTO);
        when(orderRepository.countByCustomer_User_UserId(anyInt())).thenReturn(0);

        List<UserDTO> result = userService.getAllUsers();

        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void testUpdateUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenReturn(user);
        when(userMapper.userToUserDto(any())).thenReturn(userDTO);

        UserDTO updated = userService.updateUser(1, userDTO);

        assertEquals("john@example.com", updated.getEmail());
    }

    @Test
    void testUpdateUser_NotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(1, userDTO));
    }

    @Test
    void testDeleteUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        assertDoesNotThrow(() -> userService.deleteUser(1));
        verify(userRepository).delete(user);
    }

    @Test
    void testDeleteUser_NotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(1));
    }

    @Test
    void testUpdateUserStatus_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        userService.updateUserStatus(1, UserStatus.INACTIVE);

        verify(userRepository).save(user);
        assertEquals(UserStatus.INACTIVE, user.getStatus());
    }

    @Test
    void testUpdateUserStatus_NotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.updateUserStatus(1, UserStatus.SUSPENDED));
    }

    @Test
    void testGetUserByUserName_Customer() {
        when(userRepository.findByUsername("john@example.com")).thenReturn(Optional.of(user));
        when(userMapper.userToUserDto(user)).thenReturn(userDTO);

        UserDTO result = userService.getUserByUserName("john@example.com");

        assertEquals("john@example.com", result.getUsername());
    }

    @Test
    void testGetUserByUserName_NotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserByUserName("unknown"));
    }
}

