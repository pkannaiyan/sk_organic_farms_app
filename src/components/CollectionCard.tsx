import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../constants/theme';

interface CollectionCardProps {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  onPress?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  name,
  icon,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{uri: image}} style={styles.image} resizeMode="cover" />
        ) : icon ? (
          <Text style={styles.icon}>{icon}</Text>
        ) : (
          <Text style={styles.icon}>📦</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 100,
    marginRight: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  icon: {
    fontSize: 36,
  },
  name: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CollectionCard;
