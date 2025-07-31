package com.hexaware.serviceimplementation;
//package com.hexaware.service;

import com.hexaware.dto.MenuDTO;
import com.hexaware.dto.MenuCategoryDTO;
import com.hexaware.dto.RestaurantDTO;
import com.hexaware.entity.Menu;
import com.hexaware.entity.MenuCategory;
import com.hexaware.entity.Restaurant;
import com.hexaware.mapper.MenuMapper;
import com.hexaware.repository.MenuCategoryRepository;
import com.hexaware.repository.MenuRepository;
import com.hexaware.repository.RestaurantRepository;
import com.hexaware.serviceImplementation.MenuServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceImplTest {

    @InjectMocks
    private MenuServiceImpl menuService;

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private MenuCategoryRepository menuCategoryRepository;

    @Mock
    private MenuMapper menuMapper;

    private MenuDTO menuDTO;
    private Menu menu;
    private Restaurant restaurant;
    private RestaurantDTO restaurantDTO;
    private MenuCategory category;
    private MenuCategoryDTO categoryDTO;

    @BeforeEach
    void setUp() {
        restaurant = new Restaurant();
        restaurant.setRestaurantId(1);

        category = new MenuCategory();
        category.setCategoryId(1);
        category.setCategoryName("Starters");

        restaurantDTO = new RestaurantDTO();
        restaurantDTO.setRestaurantId(1);

        categoryDTO = new MenuCategoryDTO();
        categoryDTO.setCategoryId(1);
        categoryDTO.setCategoryName("Starters");

        menuDTO = new MenuDTO();
        menuDTO.setMenuId(1);
        menuDTO.setItemName("Paneer Tikka");
        menuDTO.setDescription("Grilled paneer cubes with spices");
        menuDTO.setPrice(BigDecimal.valueOf(200));
        menuDTO.setOriginalPrice(BigDecimal.valueOf(250));
        menuDTO.setOffer(20);
        menuDTO.setRating(4.5);
        menuDTO.setImageUrl("https://th.bing.com/th/id/OIP.fhW2O9lJGdiKM4NjiNQtZQHaEL?w=301&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7");
        menuDTO.setAvailability("available");
        menuDTO.setDietaryInfo("Vegetarian");
        menuDTO.setTasteInfo("Spicy");
        menuDTO.setCookingTime(15);
        menuDTO.setCalories(300);
        menuDTO.setProteins(20.0);
        menuDTO.setFats(10.0);
        menuDTO.setCarbs(30.0);
        menuDTO.setIngredients("Paneer, Spices, Oil");
        menuDTO.setLocation("Delhi");
        menuDTO.setAvailabilityTime("11:00 AM - 11:00 PM");
        menuDTO.setAddedOn(LocalDate.now());
        menuDTO.setRestaurant(restaurantDTO);
        menuDTO.setCategory(categoryDTO);

        menu = new Menu();
        menu.setMenuId(1);
        menu.setItemName("Paneer Tikka");
        menu.setDescription("Grilled paneer cubes with spices");
        menu.setPrice(BigDecimal.valueOf(200));
        menu.setOriginalPrice(BigDecimal.valueOf(250));
        menu.setOffer(20);
        menu.setRating(4.5);
        menu.setImageUrl(menuDTO.getImageUrl());
        menu.setAvailability("available");
        menu.setDietaryInfo("Vegetarian");
        menu.setTasteInfo("Spicy");
        menu.setCookingTime(15);
        menu.setCalories(300);
        menu.setProteins(20.0);
        menu.setFats(10.0);
        menu.setCarbs(30.0);
        menu.setIngredients("Paneer, Spices, Oil");
        menu.setLocation("Delhi");
        menu.setAvailabilityTime("11:00 AM - 11:00 PM");
        menu.setAddedOn(LocalDate.now());
        menu.setRestaurant(restaurant);
        menu.setCategory(category);
    }

    @Test
    void testAddMenuItem_Success() {
        when(menuMapper.menuDtoToMenu(menuDTO)).thenReturn(menu);
        when(restaurantRepository.findById(1)).thenReturn(Optional.of(restaurant));
        when(menuCategoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(menuRepository.save(any(Menu.class))).thenReturn(menu);
        when(menuMapper.menuToMenuDto(menu)).thenReturn(menuDTO);

        MenuDTO result = menuService.addMenuItem(menuDTO);
        assertNotNull(result);
        assertEquals("Paneer Tikka", result.getItemName());
        assertEquals("https://th.bing.com/th/id/OIP.fhW2O9lJGdiKM4NjiNQtZQHaEL?w=301&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", result.getImageUrl());
    }

    @Test
    void testUpdateMenuItem_Success() {
        when(menuRepository.findById(1)).thenReturn(Optional.of(menu));
        when(restaurantRepository.findById(1)).thenReturn(Optional.of(restaurant));
        when(menuCategoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(menuRepository.save(any(Menu.class))).thenReturn(menu);
        when(menuMapper.menuToMenuDto(menu)).thenReturn(menuDTO);

        MenuDTO updated = menuService.updateMenuItem(1, menuDTO);
        assertNotNull(updated);
        assertEquals("Paneer Tikka", updated.getItemName());
    }

    @Test
    void testDeleteMenuItem_Success() {
        when(menuRepository.existsById(1)).thenReturn(true);
        doNothing().when(menuRepository).deleteById(1);
        assertDoesNotThrow(() -> menuService.deleteMenuItem(1));
        verify(menuRepository).deleteById(1);
    }

    @Test
    void testDeleteMenuItem_NotFound() {
        when(menuRepository.existsById(99)).thenReturn(false);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> menuService.deleteMenuItem(99));
        assertEquals("Menu item not found with ID: 99", ex.getMessage());
    }

    @Test
    void testToggleAvailability_ChangeToUnavailable() {
        menu.setAvailability("available");
        when(menuRepository.findById(1)).thenReturn(Optional.of(menu));
        when(menuRepository.save(menu)).thenReturn(menu);

        menuService.toggleAvailability(1);
        assertEquals("unavailable", menu.getAvailability().toLowerCase());
    }

    @Test
    void testToggleAvailability_ChangeToAvailable() {
        menu.setAvailability("unavailable");
        when(menuRepository.findById(1)).thenReturn(Optional.of(menu));
        when(menuRepository.save(menu)).thenReturn(menu);

        menuService.toggleAvailability(1);
        assertEquals("available", menu.getAvailability().toLowerCase());
    }

    @Test
    void testViewAllMenus() {
        when(menuRepository.findByRestaurantRestaurantId(1)).thenReturn(List.of(menu));
        when(menuMapper.menuToMenuDto(menu)).thenReturn(menuDTO);

        List<MenuDTO> menus = menuService.viewAllMenus();
        assertEquals(1, menus.size());
        assertEquals("Paneer Tikka", menus.get(0).getItemName());
    }

    @Test
    void testBrowseMenu() {
        when(menuRepository.findAll()).thenReturn(List.of(menu));
        when(menuMapper.menuToMenuDto(menu)).thenReturn(menuDTO);

        List<MenuDTO> menus = menuService.browseMenu();
        assertEquals(1, menus.size());
        assertEquals("Paneer Tikka", menus.get(0).getItemName());
    }
}
